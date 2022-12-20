import MessageRepository from "../repositories/MessageRepository";

export default class MessageLogic {

    static async getMessages() {
        const result = await MessageRepository.getMessages();
        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
    static async getMessage(id) {
        const result = await MessageRepository.getMessage(id);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
    static async createMessage(body) {
        const result = await MessageRepository.createMessage(body);

        if (result.response.status !== 201) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
    static async updateMessage(id, body) {
        const result = await MessageRepository.updateMessage(id, body);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
    static async deleteMessage(id) {
        const result = await MessageRepository.deleteMessage(id);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
}