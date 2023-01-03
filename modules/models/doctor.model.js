const { Schema, model } = require("mongoose");
const baseUserModel = require("./base_objects/user.model");

// List of available health services
const healthServices = require("./base_objects/health_services");
const defaultService = healthServices["generalHealth"];

const doctor = new Schema(
	{
		...baseUserModel,
		services: {
			type: [String],
			required: true,
			default: [defaultService],
		},
		institution: String,
		certifications: [String],
		medicalCouncilRegistrationNumber: {
			type: String,
			required: true,
		},
		yearsOfExperience: {
			type: Number,
			required: true,
		},
		isAvailable: {
			type: Boolean,
			required: true,
		},
		timeSlot: {
			startTime: {
				type: Date,
				required: true,
			},
			endTime: {
				type: Date,
				required: true,
			},
		},
		reviews: {
			type: [
				new Schema({
					patientId: {
						type: Schema.Types.ObjectId,
						ref: "Patient",
						required: true,
					},
					reviewMessage: {
						type: String,
						required: true,
					},
				}),
			],
		},
	},
	{ timestamps: true }
);

module.exports = model("Doctor", doctor);
