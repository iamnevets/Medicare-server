const { ResponseError } = require("../error_handlers/response_error");

const Booking = require("../models/booking.model");
const responseObject = require("../models/base_objects/response_object");

const create = async (request, response) => {
      try {
            const newBooking = await Booking.create({...request.body});

            if (!newBooking) {
                  return response.status(400).json(responseObject(null, false, "Failed to create booking."));
            }

            response.status(201).json(responseObject(userAndToken, true, "Session booked successfully."));
      } catch (error) {
            const isResponseError = error instanceof ResponseError;

		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, `Failed to create booking: ${error}`));
		}
      }
}

const update = async (request, response) => {
      try {
            const { id, bookingUpdate } = request.body;

            const updatedBooking = Booking.findByIdAndUpdate(id, { ...bookingUpdate })
            if (!updatedBooking) {
                  return response.status(400).json(responseObject(null, false, "Failed to update booking."));
            }

            response.status(201).json(responseObject(userAndToken, true, "Booking updated successfully."));
      } catch (error) {
            const isResponseError = error instanceof ResponseError;

		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, `Failed to update booking: ${error}`));
		}
      }
}

const getOne = async (request, response) => {
      try {
            const { id } = request.body;

            const booking = Booking.findById(id)
            if (!booking) {
                  return response.status(404).json(responseObject(null, false, "Booking could not be found."));
            }

            response.status(200).json(responseObject(user, true, "Successful!"));
      } catch (error) {
            const isResponseError = error instanceof ResponseError;

		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, `Failed to update booking: ${error}`));
		}
      }
}

const getAll = async (request, response) => {
	try {
		let booking = Booking.find();

		if (!booking) {
			return response.status(200).json(responseObject(null, false, "No booking found."));
		}

		response.status(200).json(responseObject(users, true, "Successful!"));
	} catch (error) {
		const isResponseError = error instanceof ResponseError;
		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, "Failed to create user."));
		}
	}
};

const cancel = async (request, response) => {
      try {
            const { id } = request.body;
            const cancelledBooking = Booking.findByIdAndDelete(id);

            if (!cancelledBooking) {
                  return response.status(400).json(responseObject(null, false, "Failed to cancel booking."));
            }

            response.status(201).json(responseObject(userAndToken, true, "Booking cancelled successfully."));
      } catch (error) {
            const isResponseError = error instanceof ResponseError;

		if (isResponseError) {
			response.status(error.responseStatus).json(responseObject(null, false, error.message));
		} else {
			response.status(500).json(responseObject(null, false, `Failed to update booking: ${error}`));
		}
      }
}

module.exports = { create, update, getOne, getAll, cancel };