const jwt = require("jsonwebtoken");

const keys = require("../config/keys");
const User = require("../models/User");
const genError = require("../utils/generateError");

module.exports = async (req, res, next) => {
  const errors = {};
  try {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      errors.message = "Auth Failed";
      return genError(res, errors, 401);
    }
    const token = bearerToken.split(" ")[1];
    if (!token) {
      errors.message = "Auth Failed";
      return genError(res, errors, 401);
    }
    const decodedToken = jwt.verify(token, keys.tokenSecret);
    if (!decodedToken) {
      errors.message = "Auth Failed";
      return genError(res, errors, 401);
    }

    if (decodedToken.exp < Date.now() / 1000) {
      errors.message = "Token expired";
      return genError(res, errors, 401);
    }

    const user = await User.findById(decodedToken._id);

    if (!user && !user.isVerified) {
      errors.message = "Auth Failed";
      return genError(res, errors, 401);
    }
    req.user = {
      _id: user._id
    };
    next();
  } catch (e) {
    return genError(res, e.message, 401);
  }
};
