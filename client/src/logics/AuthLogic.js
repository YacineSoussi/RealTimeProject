import AuthRepository from "../repositories/AuthRepository";
import LocalStorage from "../services/LocalStorage";

export default class AuthLogic {
	static async register(body) {
		const result = await AuthRepository.register(body);

		if (result.response.status === 422) {
			const errors = result.response.data;
			const errorsArray = Object.values(errors);
			throw new Error(errorsArray);
		}

		return result.response.data;
	}

	static async login(body) {
		const result = await AuthRepository.login({ ...body });

		if (result.response.status === 401) {
			throw new Error(result.response.data?.message);
		}

		const res = {};
		res.userData = result.response.data.userData[0];
		res.token = result.response.data.token;

		AuthLogic.setTokens(res);
		AuthLogic.setStorageUser();

		return res.userData;
	}

	static logout() {
		this.clear();
	}

	static isAuth() {
		return !!this.getTokens();
	}

	static getTokens() {
		return LocalStorage.get("tokens");
	}

	static setTokens(tokens) {
		LocalStorage.set("tokens", tokens);
	}

	static removeTokens() {
		LocalStorage.remove("tokens");
	}

	static clear() {
		LocalStorage.clear();
	}
	static async refreshToken(refreshToken) {
		this.deleteRefreshToken();
		const response = await AuthRepository.refresh(refreshToken);
		AuthLogic.setTokens(response.responseObject());
		return response.responseObject();
	}

	static deleteRefreshToken() {
		let token = LocalStorage.get("tokens");
		delete token.refresh_token;
		AuthLogic.setTokens(token);
	}

	static setStorageUser() {
		const user = AuthLogic.getTokens().userData;
		LocalStorage.set("user", user);
	}
}
