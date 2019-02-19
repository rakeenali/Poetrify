const isEmpty = require("lodash/isEmpty");
const Validator = require("validator");

module.exports = body => {
  let { email, password } = body;
  let errors = {};

  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (!Validator.isEmail(email)) {
    errors.email = "Please provide a valid email";
  }

  if (Validator.isEmpty(email)) {
    errors.email = "Email address field must not be empty";
  }

  if (!Validator.isLength(password, { min: 4, max: 11 })) {
    errors.password = "Password must be between 4 to 11 charachters";
  }

  if (Validator.isEmpty(password)) {
    errors.password = "Password field must not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
