import UserRepository from "../repositories/UserRepository";

export default class UserLogic {
	static async getUsers() {
		const result = await UserRepository.getUsers();
		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async getUser(id) {
		const result = await UserRepository.getUser(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async createUser(body) {
		const result = await UserRepository.createUser(body);

		if (result.response.status !== 201) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async updateUser(id, body) {
		const result = await UserRepository.updateUser(id, body);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}

	static async deleteUser(id) {
		const result = await UserRepository.deleteUser(id);

		if (result.response.status !== 200) {
			throw new Error(result.response.data?.message);
		}

		return result.response.data;
	}
}
