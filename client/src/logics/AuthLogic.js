import LocalStorage from "../services/LocalStorage";
import AuthRepository from "../repositories/AuthRepository";

export default class AuthLogic {
    static register(body) {
        return AuthRepository.register(body);
    }

    static async login(body) {

        const result = await AuthRepository.login({...body});
        if (result.response.status === 401) {
            return result;
        }
            const res = {}
            res.userData = result.response.data.userData[0];
            res.token = result.response.data.token;
            AuthLogic.setTokens(res);
            AuthLogic.setStorageUser();

            return result;
        
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
        let token = LocalStorage.get("tokens")
        delete token.refresh_token
        AuthLogic.setTokens(token)
      }

    static setStorageUser() {
        const user = AuthLogic.getTokens().userData
        ;
        LocalStorage.set("user", user);
    }
    }