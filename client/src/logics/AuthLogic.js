import LocalStorage from "../services/LocalStorage";
import AuthRepository from "../repositories/AuthRepository";

export default class AuthLogic {
    static register(body) {
        return AuthRepository.register(body);
    }

    static async login(body) {
        const response = await AuthRepository.login({...body});
        AuthLogic.setTokens({token: response.token});
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
        let token = LocalStorage.get("token")
        delete token.refresh_token
        AuthLogic.setTokens(token)
      }

    static setStorageUser() {
        const user = AuthLogic.getTokens().user;
        LocalStorage.set("user", user);
    }
    }