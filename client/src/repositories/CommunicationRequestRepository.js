import * as Request from '../services/request';

export default class CommunicationRequestRepository {
    static async getCommunicationrequests() {
        return await Request.make('get', '/communication_request');
    }
    static async getCommunicationRequest(id) {
        return await Request.make('get', `/communication_request/${id}`);
    }
    static async createCommunicationRequest(body) {
        return await Request.make('post', '/communication_request', {...body});
    }
    static async updateCommunicationRequest(id, body) {
        return await Request.make('patch', `/communication_request/${id}`, {...body});
    }
    static async deleteCommunicationRequest(id) {
        return await Request.make('delete', `/communication_request/${id}`);
    }
    }