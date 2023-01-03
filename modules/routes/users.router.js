const router = require("express").Router;
const usersRouter = router();
const authorize = require("../auth/authorization_service");

const { login, signup, create, update, getOne, getAll, changePassword } = require("../controllers/users.controller");

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);
usersRouter.route("/users").post(create).get(getAll, authorize);
usersRouter.route("/changepassword").post(changePassword, authorize);
usersRouter.route("/users/:id").all(authorize).patch(update).get(getOne);

module.exports = usersRouter;
