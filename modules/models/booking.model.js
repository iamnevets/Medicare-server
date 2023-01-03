const { Schema, model } = require("mongoose");

const booking = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        required: true
    }
},
{ timestamps: true }
);

module.exports = model("Booking", booking);