class ResponseError extends Error {
    constructor(responseStatus, message) {
        super(message);
        this.name = "ResponseError";
        this.responseStatus = responseStatus;
    }
}

module.exports = { ResponseError };