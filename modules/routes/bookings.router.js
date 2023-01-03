const router = require("express").Router;
const usersRouter = router();
const authorize = require("../auth/authorization_service");

const { create, update, getOne, getAll, cancel } = require("../controllers/bookings.controller");

usersRouter.route("/users").post(create).get(getAll, authorize);
usersRouter.route("/users/:id").all(authorize).patch(update).get(getOne).delete(cancel);

module.exports = usersRouter;