import * as Request from '../services/request';

export default class AuthRepository {
    static async login({email, password}) {
        
        return await Request.make('post', '/login', { email, password })

        // fetch api
        // const response = await fetch('http://localhost:3000/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({email, password})
        // })
        // const data = await response.json();
        // return data;
    }

    static async register(body) {
        return await Request.make('post', '/register', {...body});
    }

    static async logout() {
        return await Request.make('post', '/logout');
    }

    static async refresh() {
        return await Request.make('post', '/refresh');
    }

    static async me() {
        return await Request.make('get', '/me', { params: { include: 'roles' } });
    }
    static refreshToken(refreshToken) {
        return Request.make('post', '/oauth/token', { refresh_token: refreshToken });
    }

}
