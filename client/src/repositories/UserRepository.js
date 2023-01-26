import * as Request from "../services/request";

export default class UserRepository {
	static async getUsers() {
		return await Request.make("get", "/users");
	}

	static async getUser(id) {
		return await Request.make("get", `/users/${id}`);
	}

	static async createUser(body) {
		return await Request.make("post", "/users", { ...body });
	}

	static async updateUser(id, body) {
		return await Request.make("put", `/users/${id}`, { ...body });
	}

	static async deleteUser(id) {
		return await Request.make("delete", `/users/${id}`);
	}
}
