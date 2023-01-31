import ConversationRepository from "../repositories/ConversationRepository";

export default class ConversationLogic {
	static async getConversations() {
		const result = await ConversationRepository.getConversations();

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async getConversationOfUser(id) {
		const result = await ConversationRepository.getConversationOfUser(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async getConversation(id) {
		const result = await ConversationRepository.getConversation(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async createConversation(body) {
		const result = await ConversationRepository.createConversation(body);

		if (result.response.status !== 201) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async updateConversation(id, body) {
		const result = await ConversationRepository.updateConversation(id, body);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async deleteConversation(id) {
		const result = await ConversationRepository.deleteConversation(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async postParticipant({ conversationId, userId }) {
		const result = await ConversationRepository.postParticipant({
			conversationId,
			userId,
		});

		if (result.response.status !== 201) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async createRoom(body) {
		const result = await ConversationRepository.createRoom(body);

		if (result.response.status !== 201) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async getParticipants(id) {
		const result = await ConversationRepository.getParticipants(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data);
		}

		return result.response.data;
	}
}
