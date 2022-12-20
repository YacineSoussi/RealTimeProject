import axios from 'axios';
import AuthLogic from '../logics/AuthLogic';
import LocalStorage from '../services/LocalStorage';
import JsonApiResponse from '../services/JsonApiResponse';


const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

request.interceptors.request.use(
    config => {
        const token = LocalStorage.get("tokens");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token.token}`;
        }
        return config;
    }
);  

export default request;

export const make = async (method, url, data = {}) => {
    const config = {
        method,
        url,
        data
    };

    try {
        const response = await request(config);
        return new JsonApiResponse(response);
    } catch (error) {
        console.log('error', error);
        if (error.response.status === 401) {
           return new JsonApiResponse(error.response);
        }
        return new JsonApiResponse(error.response);
    }
}
