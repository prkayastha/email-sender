/**
 * Class for global response
 */
class SuccessResponse {
    /**
     * Create a global response instance
     */
    constructor() {
        this.statusCode = 0;
        this.message = null;
    }

    /**
     * initialize a global success response with status code and message
     * @param {number} code response status code
     * @param {string} message response message 
     */
    static getSuccessResponse(code, message) {
        const response = new SuccessResponse();
        response.statusCode = code;
        response.message = message;

        return response;
    }
}

module.exports = SuccessResponse;