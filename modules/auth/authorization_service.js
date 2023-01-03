const { ResponseError } = require("../error_handlers/response_error");

const { verifyToken } = require("./json_web_token");
const responseObject = require("../models/base_objects/response_object");

const authorizeRequest = (request, response, next) => {
	try {
		const authorizationRequestHeader = request.headers.authorization;
		if (!authorizationRequestHeader) {
			return response.status(401).json(responseObject(null, false, "Access Denied / Unauthorized request"));
		}

		const tokenFromRequest = authorizationRequestHeader.split("")[1];
		if (tokenFromRequest === null || !tokenFromRequest) {
			return response.status(401).json(responseObject(null, false, "Unauthorized request"));
		}

		const authorizedUser = verifyToken(tokenFromRequest);
		if (!authorizedUser) {
			return response.status(401).json(responseObject(null, false, "Unauthorized request"));
		}

		request.user = authorizedUser;

		next();
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to authorize request."));
		}
	}
};

module.exports = authorizeRequest;
