import axios from 'axios';
import JsonApiResponse from './JsonApiResponse';
import AuthLogic from '../logics/AuthLogic';

class Request {
    constructor() {
        this.client = axios.create({
          baseURL: import.meta.env.VUE_APP_API_URL,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // withCredentials: true,
        })
    
        this.client.interceptors.request.use(config => {
          const tokens = AuthLogic.getTokens()
    
          if (tokens) {
            config.headers["Authorization"] = `Bearer ${tokens.access_token}`
          }
    
          return Promise.resolve(config)
        });

        
      }

        /**
   * Make a new AJAX request.
   *
   * @param {string} method
   * @param {string} url
   * @param {Object} config
   * @returns {Promise}
   */
  async make(method, url, config = {}) {
    try {
      let response = await this.client[method.toLowerCase()](url, config)
      return new JsonApiResponse(response)
    } catch (error) {
      return await this.parseError(error, url)
    }
  }
}

export default new Request();