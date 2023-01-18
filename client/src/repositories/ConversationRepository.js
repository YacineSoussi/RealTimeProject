import * as Request from '../services/request';

export default class ConversationRepository {
    
    static async getConversations() {
        return await Request.make('get', '/conversations');
    }
    static async getConversationOfUser(id) {
        return await Request.make('get', `/myconversations/${id}`);
    }
    static async getConversation(id) {
        return await Request.make('get', `/conversations/${id}`);
    }
    static async createConversation(body) {
        return await Request.make('post', '/conversations', {...body});
    }
    static async createRoom(body) {
        return await Request.make('post', '/rooms', {...body});
    }
    static async updateConversation(id, body) {
        return await Request.make('patch', `/conversations/${id}`, {...body});
    }
    static async deleteConversation(id) {
        return await Request.make('delete', `/conversations/${id}`);
    }
    static async postParticipant({conversationId, userId}) {
        return await Request.make('post', `/participants`, {conversationId, userId});
    }
    static async getParticipants(id) {
        return await Request.make('get', `/participantsOfConversation/${id}`);
    }
    static async deleteParticipant(id) {
        return await Request.make('delete', `/participants/${id}`);
    }
}
