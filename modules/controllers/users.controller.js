const { ResponseError } = require("../error_handlers/response_error");

const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const bcrypt = require("bcryptjs");
const responseObject = require("../models/base_objects/response_object");
const verifyUserAndIssueToken = require("../auth/authentication_service");

const typeOfUsers = {
	doctor: "doctor",
	patient: "patient",
};

const signup = async (request, response) => {
	try {
		const { email, password, typeOfUser } = request.body;

		let emailExists = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			emailExists = await Doctor.findOne({ email });
		} else if (typeOfUser == typeOfUsers.patient) {
			emailExists = await Patient.findOne({ email });
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (emailExists) {
			return response.status(400).json(responseObject(null, false, "Email already in use."));
		}

		userObjectToReturn = {
			email: email,
			password: password,
			typeOfUser: typeOfUser,
		};

		response.status(200).json(responseObject(userObjectToReturn, true, "Signed up successfully."));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to sign up."));
		}
	}
};

const login = async (request, response) => {
	try {
		const { email, password, typeOfUser } = request.body;

		let user = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			user = await Doctor.findOne({ email });
		} else if (typeOfUser === typeOfUsers.patient) {
			user = await Patient.findOne({ email });
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (!user) {
			return response.status(400).json(responseObject(null, false, "Invalid credentials"));
		}

		const userAndTokenObject = await verifyUserAndIssueToken(user._id, email, password);

		response.status(200).json(responseObject(userAndTokenObject, true, "Logged in successfully."));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to login."));
		}
	}
};

const changePassword = async (request, response) => {
	try {
		const { oldPassword, newPassword, newPasswordConfirmation, id, typeOfUser } = request.body;

		let user = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			user = await Doctor.findById(id);
		} else if (typeOfUser === typeOfUsers.patient) {
			user = await Patient.findById(id);
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (!user) {
			return response.status(400).json(responseObject(null, false, "Invalid credentials."));
		}

		const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

		if (!isPasswordCorrect) {
			return response.status(400).json(responseObject(null, false, "Invalid credentials."));
		}
		
		if (newPassword !== newPasswordConfirmation) {
			return response.status(400).json(responseObject(null, false, "Passwords don't match."));
		}

		return user;
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to change password."));
		}
	}
};

const create = async (request, response) => {
	try {
		const { password, typeOfUser } = request.body;
		const hashedPassword = await bcrypt.hash(password, 12);

		let newlyCreatedUser = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			newlyCreatedUser = await Doctor.create({ ...request.body, password: hashedPassword });
		} else if (typeOfUser === typeOfUsers.patient) {
			newlyCreatedUser = await Patient.create({ ...request.body, password: hashedPassword });
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (!newlyCreatedUser) {
			return response.status(400).json(responseObject(null, false, "Failed to create user."));
		}

		const userAndToken = await verifyUserAndIssueToken(newlyCreatedUser._id, email, password, typeOfUser);

		response.status(201).json(responseObject(userAndToken, true, "User created successfully."));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;

		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else if (typeof error.message === "string" && error.message.includes("duplicate key")) {
			response.status(409).json(responseObject(null, false, "email already exists."));
		} else {
			response.status(500).json(responseObject(null, false, `Failed to create user: ${error}`));
		}
	}
};

const update = async (request, response) => {
	try {
		const { id, userUpdate } = request.body;
		const { typeOfUser } = userUpdate;

		let updatedUser = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			updatedUser = await Doctor.findByIdAndUpdate(id, { ...userUpdate });
		} else if (typeOfUser === typeOfUsers.patient) {
			updatedUser = await Patient.findByIdAndUpdate(id, { ...userUpdate });
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (!updatedUser) {
			return response.status(404).json(responseObject(null, false, "User could not be found nor updated."));
		}

		response.status(201).json(responseObject(updatedUser, true, "User updated successfully."));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to create user."));
		}
	}
};

const getOne = async (request, response) => {
	try {
		const { id, typeOfUser } = request.body;

		let user = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			user = await Doctor.findById(id);
		} else if (typeOfUser === typeOfUsers.patient) {
			user = await Patient.findById(id);
		} else {
			return response.status(400).json(responseObject(null, false, "Type of user either not supplied, or is invalid."));
		}

		if (!user) {
			return response.status(404).json(responseObject(null, false, "User could not be found."));
		}

		response.status(200).json(responseObject(user, true, "Successful!"));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to create user."));
		}
	}
};

const getAll = async (request, response) => {
	try {
		const { typeOfUser } = request.body;

		let users = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			users = Doctor.find();
		} else if (typeOfUser === typeOfUsers.patient) {
			users = Patient.find();
		}

		if (!users) {
			return response.status(200).json(responseObject(null, false, "No user found."));
		}

		response.status(200).json(responseObject(users, true, "Successful!"));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to get all users."));
		}
	}
};

module.exports = { login, signup, create, update, getOne, getAll, changePassword };
