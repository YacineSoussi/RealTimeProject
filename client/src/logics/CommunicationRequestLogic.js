import CommunicationRequestRepository from "../repositories/CommunicationRequestRepository";

export default class CommunicationRequestLogic {
    
    static async getCommunicationRequests() {
        const result = await CommunicationRequestRepository.getCommunicationrequests();

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }

        return result.response.data;
    }

    static async getCommunicationRequest(id) {
        const result = await CommunicationRequestRepository.getCommunicationRequest(id);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }

        return result.response.data;
    }

    static async createCommunicationRequest(body) {
        const result = await CommunicationRequestRepository.createCommunicationRequest(body);

        if (result.response.status !== 201) {
            throw new Error(result.response.data?.message);
        }

        return result.response.data;
    }

    static async updateCommunicationRequest(id, body) {
        const result = await CommunicationRequestRepository.updateCommunicationRequest(id, body);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }

    static async deleteCommunicationRequest(id) {
        const result = await CommunicationRequestRepository.deleteCommunicationRequest(id);

        if (result.response.status !== 200) {
            throw new Error(result.response.data?.message);
        }
        return result.response.data;
    }
}