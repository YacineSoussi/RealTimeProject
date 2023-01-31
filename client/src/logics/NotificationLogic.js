import NotificationRepository from "../repositories/NotificationRepository";

export default class NotificationLogic {
	static async createNotification(body) {
		const result = await NotificationRepository.createNotification(body);

		if (result.response.status !== 201) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}
}
