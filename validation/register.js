const isEmpty = require("lodash/isEmpty");
const Validator = require("validator");

module.exports = body => {
  let { name, email, password } = body;
  let errors = {};

  name = !isEmpty(name) ? name : "";
  email = !isEmpty(email) ? email : "";
  password = !isEmpty(password) ? password : "";

  if (!Validator.isLength(name, { min: 3, max: 20 })) {
    errors.name = "Name field must be between 2 to 20 characters";
  }

  if (Validator.isEmpty(name)) {
    errors.name = "Name field must not be empty";
  }

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
