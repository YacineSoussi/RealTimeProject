import ConversationLogic from "@/logics/ConversationLogic";
import { defineStore } from "pinia";

export const useConversationStore = defineStore({
	id: "conversation",
	state: () => ({
		conversations: [],
		rooms: [],
		selectedConversation: {},
		selectedConversationId: null,
		updatedConversation: [],
	}),
	getters: {
		getterRooms() {
			return this.rooms;
		},
		getterConversations() {
			return this.conversations;
		},
		getterSelectedConversation() {
			return this.selectedConversation;
		},
		getterSelectedConversationId() {
			return this.selectedConversationId;
		},
		getterUpdatedConversation() {
			return this.updatedConversation;
		},
	},
	actions: {
		async deleteConversation(id) {
			return ConversationLogic.deleteConversation(id).then((data) => {
				this.conversations = this.conversations.filter(
					(conversation) => conversation.id !== id
				);

				this.rooms = this.rooms.filter((room) => room.id !== id);
				return data;
			});
		},
		async updateConversation(id, form) {
			return ConversationLogic.updateConversation(id, { ...form }).then(
				(data) => {
					this.updatedConversation = data;
					return data;
				}
			);
		},
		async createConversation(form) {
			const conversation = await ConversationLogic.createConversation({
				...form,
				completed: true,
				maxParticipants: 2,
				type: "conversation",
			});

			this.conversations.push(conversation);
			this.selectedConversationId = conversation.id;

			return conversation;
		},
		async createRoom(form) {
			await ConversationLogic.createRoom({ ...form, type: "room" }).then(
				(data) => {
					this.conversations.push(data);
					this.rooms.push(data);
					return data;
				}
			);
		},
		async updateRoom(form, id) {
			return ConversationLogic.updateConversation(id, { ...form }).then(
				(data) => {
					this.rooms = this.rooms.map((room) => {
						if (room.id === id) {
							return {
								...room,
								...data,
							};
						}
						return room;
					});
					return data;
				}
			);
		},
		async getConversation(id) {
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

				const newConversation = { ...data, lastMessage };
				this.selectedConversation = newConversation;

				return newConversation;
			});
		},
		async getConversations() {
			await ConversationLogic.getConversations().then((data) => {
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

				this.rooms = conversations.filter((room) => room.type === "room");
			});
		},
		async getConversationOfUser(userId) {
			const conversation = await ConversationLogic.getConversationOfUser(
				userId
			);
			this.selectedConversation = conversation;
			this.selectedConversationId = conversation.id;
		},
		async createConversation(form) {
			await ConversationLogic.createConversation(form).then((conversation) => {
				this.conversations.push(conversation);
				this.selectedConversationId = conversation.id;
			});
		},
		async setSelectConversationId(id) {
			this.selectedConversationId = id;
		},
		filterByUpdated(conversations) {
			return conversations.sort((a, b) => {
				if (!a.lastMessage || !b.lastMessage) {
					return 0;
				}

				return (
					new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
				);
			});
		},
	},
});

export function initialFetchConversations() {
	useConversationStore().getConversations();
}
