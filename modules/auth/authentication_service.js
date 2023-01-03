const bcrypt = require("bcryptjs");

const { ResponseError } = require("../error_handlers/response_error");
const { generateToken } = require("./json_web_token");
const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");

const typeOfUsers = {
	doctor: "doctor",
	patient: "patient",
};

async function getUser(email, password, typeOfUser) {
	try {
		let user = undefined;
		if (typeOfUser === typeOfUsers.doctor) {
			user = await Doctor.findOne({ email });
		} else if (typeOfUser === typeOfUsers.patient) {
			user = await Patient.findOne({ email });
		} else {
			throw new ResponseError(400, "Type of user either not supplied, or is invalid.");
		}

		if (!user) {
			throw new ResponseError(400, "Could not find user, check email.");
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			throw new ResponseError(400, "Invalid password.");
		}

		return user;
	} catch (error) {
		throw error;
	}
}

const issueToken = (id, email) => {
	try {
		const token = generateToken({ id, email });

		if (token) {
			return token;
		} else {
			throw new ResponseError(500, "Failed to generate token.");
		}
	} catch (error) {
		throw error;
	}
};

const verifyUserAndIssueToken = async (id, email, password, typeOfUser) => {
	try {
		const user = await getUser(email, password, typeOfUser);
		const token = issueToken(id, email);

		return {
			user: user,
			token: token,
		};
	} catch (error) {
		throw error;
	}
};

module.exports = verifyUserAndIssueToken;
