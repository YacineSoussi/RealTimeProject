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
	return ConversationLogic.getConversations().then((data) => {
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
	});
};

const getConversationOfUser = () => {
	return ConversationLogic.getConversationOfUser(User?.id).then((data) => {
		const myConversations = data.map((conversation) => {
			let lastMessage = data.lastMessage ? data.lastMessage : null;

			if (conversation.messages.length > 0) {
				lastMessage = conversation.messages[0];
			}

			// If it's a room, we write it in the socket
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
	});
};

const getMessages = (id) => {
	return MessageLogic.getMessages(id).then((data) => (messages.value = data));
};

const getConversation = (id) => {
	return ConversationLogic.getConversation(id).then((data) => {
		// We sort messages by creation date to avoid changing the order of messages when they are modified
		const sortedConversation = data.messages.sort(
			(a, b) => new Date(a.createdAt) - new Date(b.createdAt)
		);

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
	});
};

const createConversation = (form) => {
	return ConversationLogic.createConversation({
		...form,
		completed: true,
		maxParticipants: 2,
		type: "conversation",
	}).then((data) => {
		conversations.value.push(data);
		selectedConversationId.value = data.id;
	});
};

const createRoom = (form) => {
	return ConversationLogic.createRoom({ ...form, type: "room" }).then(
		(data) => {
			conversations.value.push(data);
			selectedConversationId.value = data.id;
			return data;
		}
	);
};

const updateConversation = (id, form) => {
	return ConversationLogic.updateConversation(id, { ...form }).then((data) => {
		updatedConversation.value = data;
		return data;
	});
};

const deleteConversation = (id) => {
	return ConversationLogic.deleteConversation(id).then(() => {
		conversations.value = conversations.value.filter(
			(conversation) => conversation.id !== id
		);
	});
};

const createMessage = (form) => {
	return MessageLogic.createMessage({ ...form }).then((data) => {
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

		// We update the conversation in the list of conversations
		conversations.value = conversations.value.map((conversation) => {
			if (conversation.id === data.conversationId) {
				return ConversationMaj;
			}

			return conversation;
		});

		filterByUpdated(conversations.value);

		return data;
	});
};

const updateMessage = (id, form) => {
	return MessageLogic.updateMessage(id, { ...form }).then((data) => {
		messages.value = messages.value.map((message) => {
			if (message.id === id) {
				return data;
			}

			return message;
		});
	});
};

const deleteMessage = (id) => {
	return MessageLogic.deleteMessage(id).then(() => {
		messages.value = messages.value.filter((message) => message.id !== id);
	});
};

const setSelectedConversationId = (id) => {
	selectedConversationId.value = id;
};

const getParticipants = (id) => {
	return ConversationLogic.getParticipants(id).then((data) => {
		participantsOFConversation.value = data;
		return data;
	});
};

const postParticipant = (form) => {
	return ConversationLogic.postParticipant({ ...form }).then((data) => {
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
	});
};

const getUser = (id) => {
	return UserLogic.getUser(id).then((data) => {
		return data;
	});
};

const setValueModal = () => (isOpenModal.value = !isOpenModal.value);

const setValueModalChat = () =>
	(isOpenModalChat.value = !isOpenModalChat.value);

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
	return UserLogic.getUsers().then((data) => {
		data = data.filter((user) => user.id !== User.id);
		users.value = data;
		return data;
	});
};

// When changing the selected conversation, we retrieve the messages of the conversation & the participants of the conversation
watchEffect(() => {
	getUsers();

	if (selectedConversationId.value) {
		getConversation(selectedConversationId.value);
		getParticipants(selectedConversationId.value);
	}
});

// When the user changes, we retrieve the user's conversations by sorting them by date of update
watchEffect(() => {
	if (User?.id) {
		filterByUpdated(conversations.value);
	}
});

// When the page loads, we get all the rooms
watchEffect(() => {
	getConversations();
});

onMounted(() => {
	const userId = User.id;

	socketRef.current = socket;
	socketRef.current.auth = { userId };
	socketRef.current.connect();

	socketRef.current.on("message:private", ({ ConversationMaj, data }) => {
		// We update the selected conversation
		selectedConversation.value = ConversationMaj;

		// we update the conversation in the list of conversations
		conversations.value = conversations.value.map((conversation) => {
			if (conversation.id === data.conversationId) {
				return ConversationMaj;
			}

			return conversation;
		});
	});

	socketRef.current.on("message:room", ({ ConversationMaj, data }) => {
		// We update the selected conversation
		selectedConversation.value = ConversationMaj;

		// owe update the conversation in the list of conversations
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
