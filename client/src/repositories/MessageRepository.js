import * as Request from '../services/request';

export default class MessageRepository {

    static async getMessages() {
        return await Request.make('get', '/messages');
    }
    static async getMessage(id) {
        return await Request.make('get', `/messages/${id}`);
    }
    static async createMessage(body) {  
        return await Request.make('post', '/messages', {...body});
    }
    static async updateMessage(id, body) {
        return await Request.make('put', `/messages/${id}`, {...body});
    }
    static async deleteMessage(id) {
        return await Request.make('delete', `/messages/${id}`);
    }

}