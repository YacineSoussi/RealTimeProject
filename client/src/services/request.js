import JsonApiResponse from "../services/JsonApiResponse";
import LocalStorage from "../services/LocalStorage";
import axios from "axios";

const request = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

request.interceptors.request.use((config) => {
	const token = LocalStorage.get("tokens");

	if (token) {
		config.headers.Authorization = `Bearer ${token.token}`;
	}

	return config;
});

export default request;

export const make = async (method, url, data = {}) => {
	const config = {
		method,
		url,
		data,
	};

	try {
		const response = await request(config);
		return new JsonApiResponse(response);
	} catch (error) {
		return new JsonApiResponse(error.response);
	}
};
