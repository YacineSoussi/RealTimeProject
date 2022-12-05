import LocalStorage from "../services/LocalStorage";
import AuthRepository from "../repositories/AuthRepository";

export default class AuthLogic {
    static register(body) {
        return AuthRepository.register(body);
    }

    static async login(body) {
        const response = await AuthRepository.login({...body})
        const result = response.responseObject();
        result.userData = response.responseObject().userData[0];
        AuthLogic.setTokens(result);
        AuthLogic.setStorageUser();
        
        return response;
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
        const user = AuthLogic.getTokens().userData
        ;
        LocalStorage.set("user", user);
    }
    }