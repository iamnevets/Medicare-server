const { ResponseError } = require("../error_handlers/response_error");

require('dotenv').config();

const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;


const generateToken = (payload) => {
  const token = jwt.sign(payload, jwtSecretKey, {
      expiresIn: "1h",
    }
  );

  return token;
};


const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, jwtSecretKey);

    return payload;
  } catch (error) {
    throw new ResponseError(500, "Token could not be verified");
  }
    
}

module.exports = { generateToken, verifyToken };