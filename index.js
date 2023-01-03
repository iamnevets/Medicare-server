const express = require("express");
const connectDb = require("./modules/config/connectDb");
const usersRouter = require("./modules/routes/users.router");

const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
// const PORT = "8080";

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("welcome to my server");
});

app.use(usersRouter);

async function start() {
  await connectDb();
  app.listen(port, (req, res) => {
    console.log(`server running on https://localhost/${port}`);
  });
}

start();
