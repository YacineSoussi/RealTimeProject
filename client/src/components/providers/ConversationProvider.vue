<script setup>
import { ref, provide, onMounted, watchEffect } from "vue";
import ConversationLogic from "../../logics/ConversationLogic";
import UserLogic from "../../logics/UserLogic";
import MessageLogic from "../../logics/MessageLogic";
import LocalStorage from "../../services/LocalStorage";
import socket from "../../services/Socket";

const User = LocalStorage.get("user");

const messages = ref([]);
const conversations = ref([]);
const rooms = ref([]);
const selectedConversation = ref(null);
const selectedConversationId = ref(null);
const updatedConversation = ref(null);
const participantsOFConversation = ref(null);
const isOpenModal = ref(false);
const isOpenModalChat = ref(false);
const users = ref([]);
const socketRef = ref(null);

const filterByUpdated = (conversations) => {
	return conversations.sort((a, b) => {
		if (!a.lastMessage || !b.lastMessage) {
			return 0;
		}

		return (
			new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
		);
	});
};

const getConversations = () => {
	return ConversationLogic.getConversations()
		.then((data) => {
			const conversations = data.map((conversation) => {
				let lastMessage = null;

				if (conversation.messages.length > 0) {
					lastMessage = conversation.messages[0];
				}

				return {
					...conversation,
					lastMessage,
				};
			});

			rooms.value = conversations.filter((room) => room.type === "room");
		})
		.catch((err) => {
			console.error(err);
		});
};

const getConversationOfUser = () => {
	return ConversationLogic.getConversationOfUser(User.id)
		.then((data) => {
			const myConversations = data.map((conversation) => {
				let lastMessage = data.lastMessage ? data.lastMessage : null;

				if (conversation.messages.length > 0) {
					lastMessage = conversation.messages[0];
				}

				// si c'est une room on l'inscrit dans la socket
				if (conversation.type === "room") {
					socketRef.current.emit("join:room", {
						roomId: conversation.id,
						userId: User.id,
					});
				}

				return {
					...conversation,
					lastMessage,
				};
			});

			conversations.value = myConversations;
			conversations.value = filterByUpdated(conversations.value);
		})
		.catch((err) => {
			console.error(err);
		});
};

const getMessages = (id) => {
	return MessageLogic.getMessages(id)
		.then((data) => {
			messages.value = data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const getConversation = (id) => {
	return ConversationLogic.getConversation(id)
		.then((data) => {
			// On trie les messages par date de creation pour eviter de changer l'ordre des messages quand ils sont modifié
			const sortedConversation = data.messages.sort((a, b) => {
				return new Date(a.createdAt) - new Date(b.createdAt);
			});

			data.messages = sortedConversation;

			let lastMessage = null;

			if (data.messages.length > 0) {
				lastMessage = data.messages[0];
			}

			const newConversation = {
				...data,
				lastMessage,
			};

			selectedConversation.value = newConversation;
			return newConversation;
		})
		.catch((err) => {
			console.error(err);
		});
};

const createConversation = (form) => {
	return ConversationLogic.createConversation({
		...form,
		completed: true,
		maxParticipants: 2,
		type: "conversation",
	})
		.then((data) => {
			conversations.value.push(data);
			selectedConversationId.value = data.id;
		})
		.catch((err) => {
			console.error(err);
		});
};

const createRoom = (form) => {
	return ConversationLogic.createRoom({ ...form, type: "room" })
		.then((data) => {
			conversations.value.push(data);
			selectedConversationId.value = data.id;
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const updateConversation = (id, form) => {
	return ConversationLogic.updateConversation(id, { ...form })
		.then((data) => {
			updatedConversation.value = data;
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const deleteConversation = (id) => {
	return ConversationLogic.deleteConversation(id)
		.then(() => {
			conversations.value = conversations.value.filter(
				(conversation) => conversation.id !== id
			);
		})
		.catch((err) => {
			console.error(err);
		});
};

const createMessage = (form) => {
	return MessageLogic.createMessage({ ...form })
		.then((data) => {
			data.author = User;

			const ConversationMaj = {
				lastMessage: data,
				messages: [...selectedConversation.value.messages, data],
				id: selectedConversation.value.id,
				name: selectedConversation.value?.name,
				participants: selectedConversation.value?.participants,
				updatedAt: data.updatedAt,
				createdAt: data.createdAt,
				lastMessageId: data.id,
				maxParticipants: selectedConversation.value?.maxParticipants,
				completed: selectedConversation.value?.completed,
				type: selectedConversation.value?.type,
			};

			selectedConversation.value = ConversationMaj;

			if (selectedConversation.value.type === "conversation") {
				const otherParticipant = ConversationMaj.participants.find(
					(participant) => participant.userId !== User.id
				);
				socketRef.current.emit("message:private", {
					ConversationMaj,
					to: otherParticipant.userId,
					content: data.content,
					data,
					author: User.id,
				});
			} else {
				socketRef.current.emit("message:room", {
					content: data.content,
					to: selectedConversation.value.id,
					data,
					author: User.id,
					ConversationMaj,
				});
			}

			//  On met à jour la conversation dans la liste des conversations
			conversations.value = conversations.value.map((conversation) => {
				if (conversation.id === data.conversationId) {
					return ConversationMaj;
				}

				return conversation;
			});

			filterByUpdated(conversations.value);

			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const updateMessage = (id, form) => {
	return MessageLogic.updateMessage(id, { ...form })
		.then((data) => {
			messages.value = messages.value.map((message) => {
				if (message.id === id) {
					return data;
				}
				return message;
			});
		})
		.catch((err) => {
			console.error(err);
		});
};

const deleteMessage = (id) => {
	return MessageLogic.deleteMessage(id)
		.then(() => {
			messages.value = messages.value.filter((message) => message.id !== id);
		})
		.catch((err) => {
			console.error(err);
		});
};

const setSelectedConversationId = (id) => {
	selectedConversationId.value = id;
};

const getParticipants = (id) => {
	return ConversationLogic.getParticipants(id)
		.then((data) => {
			participantsOFConversation.value = data;
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const postParticipant = (form) => {
	return ConversationLogic.postParticipant({ ...form })
		.then((data) => {
			conversations.value.push(data.conversation);
			rooms.value = rooms.value.map((room) => {
				if (room.id === data.conversationId) {
					return {
						...room,
						participants: [...room.participants, data],
					};
				}
				return room;
			});
		})
		.catch((err) => {
			console.error(err);
		});
};

const getUser = (id) => {
	return UserLogic.getUser(id)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

const setValueModal = () => {
	isOpenModal.value = !isOpenModal.value;
};

const setValueModalChat = () => {
	isOpenModalChat.value = !isOpenModalChat.value;
};

const checkUserInConversation = (conversation) => {
	if (conversation.participants) {
		if (
			conversation.participants.find(
				(participant) => participant.userId === User.id
			)
		) {
			return true;
		}
	}
	return false;
};

const checkIfUserHaveConversationWithOtherUser = (userId) => {
	if (conversations.value) {
		const conversation = conversations.value.find((conversation) => {
			if (conversation.participants) {
				if (conversation.participants.length === 2) {
					if (
						conversation.participants.find(
							(participant) => participant.userId === userId
						)
					) {
						return true;
					}
				}
			}
			return false;
		});
		if (conversation) {
			return true;
		}
	}
	return false;
};

const getUsers = () => {
	return UserLogic.getUsers()
		.then((data) => {
			data = data.filter((user) => user.id !== User.id);
			users.value = data;
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
};

// Au changement de la conversation selectionnée, on récupère les messages de la conversation & les participants de la conversation
watchEffect(() => {
	getUsers();
	if (selectedConversationId.value) {
		getConversation(selectedConversationId.value);
		getParticipants(selectedConversationId.value);
	}
});

// Au changement de l'utilisateur, on récupère les conversations de l'utilisateur en les triant par date de mise à jour
watchEffect(() => {
	if (User?.id) {
		filterByUpdated(conversations.value);
	}
});

// Au chargement de la page, on récupère toutes les rooms
watchEffect(() => {
	getConversations();
});

onMounted(() => {
	const userId = User.id;

	socketRef.current = socket;
	socketRef.current.auth = { userId };
	socketRef.current.connect();

	socketRef.current.on("message:private", ({ ConversationMaj, data }) => {
		// On met à jour la conversation selectionnée
		selectedConversation.value = ConversationMaj;

		// On met à jour la conversation dans la liste des conversations
		conversations.value = conversations.value.map((conversation) => {
			if (conversation.id === data.conversationId) {
				return ConversationMaj;
			}
			return conversation;
		});
	});

	socketRef.current.on("message:room", ({ ConversationMaj, data }) => {
		// On met à jour la conversation selectionnée
		selectedConversation.value = ConversationMaj;

		// On met à jour la conversation dans la liste des conversations
		conversations.value = conversations.value.map((conversation) => {
			if (conversation.id === data.conversationId) {
				return ConversationMaj;
			}

			return conversation;
		});
	});
});

provide("ProviderMessages", messages);
provide("ProviderConversations", conversations);
provide("ProviderSelectedConversation", selectedConversation);
provide("ProviderSelectedConversationId", selectedConversationId);
provide("ProviderUpdatedConversation", updatedConversation);
provide("ProviderUser", User);
provide("ProviderParticipantsOFConversation", participantsOFConversation);
provide("ProviderIsOpenModal", isOpenModal);
provide("ProviderRooms", rooms);
provide("ProviderIsOpenModalChat", isOpenModalChat);
provide("ProviderUsers", users);
provide("ProviderSocket", socketRef.current);
provide("ProviderGetConversations", getConversations);
provide("ProviderGetConversationOfUser", getConversationOfUser);
provide("ProviderGetMessages", getMessages);
provide("ProviderGetConversation", getConversation);
provide("ProviderCreateConversation", createConversation);
provide("ProviderUpdateConversation", updateConversation);
provide("ProviderDeleteConversation", deleteConversation);
provide("ProviderCreateMessage", createMessage);
provide("ProviderUpdateMessage", updateMessage);
provide("ProviderDeleteMessage", deleteMessage);
provide("ProviderSetSelectedConversationId", setSelectedConversationId);
provide("ProviderCreateRoom", createRoom);
provide("ProviderGetUser", getUser);
provide("ProviderSetValueModal", setValueModal);
provide("ProviderCheckUserInConversation", checkUserInConversation);
provide("ProviderPostParticipant", postParticipant);
provide("ProviderSetValueModalChat", setValueModalChat);
provide("ProviderGetUsers", getUsers);
provide(
	"ProviderCheckIfUserHaveConversationWithOtherUser",
	checkIfUserHaveConversationWithOtherUser
);
</script>

<template>
	<slot></slot>
</template>
