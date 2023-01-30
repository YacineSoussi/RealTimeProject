import * as Request from '../services/request';

export default class NotificationRepository {

    static async createNotification(body) {  
        return await Request.make('post', '/notifications', {...body});
    }

}