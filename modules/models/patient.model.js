const { Schema, model } = require("mongoose");
const baseUserModel = require("./base_objects/user.model");

const patient = new Schema(
	{
		...baseUserModel,
		bloodGroup: {
			type: String,
			enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
			required: true,
		},
		allergies: {
			type: [String],
			required: true,
			default: ["none"],
		},
		medicalHistory: {
			type: [
				new Schema({
					doctorId: {
						type: Schema.Types.ObjectId,
						ref: "Doctor",
						required: true,
					},
					symptoms: [String],
					priorTreatment: {
						type: String,
						default: "none",
					},
					diagnosis: {
						type: String,
						required: true,
					},
					prescription: {
						type: [String],
						required: true,
					},
					startDateOfMedication: {
						type: Date,
						required: true,
					},
					endDateOfMedication: {
						type: Date,
						required: true,
					},
					doctorsRemark: String,
				}),
			],
		},
	},
	{ timestamps: true }
);

module.exports = model("Patient", patient);
