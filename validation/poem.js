const isEmpty = require("lodash/isEmpty");
const Validator = require("validator");

module.exports = body => {
  let { description } = body;
  let errors = {};

  description = !isEmpty(description) ? description : "";

  if (!Validator.isLength(description, { min: 7 })) {
    errors.description =
      "Description field must consist of more than 7 characters";
  }

  if (Validator.isEmpty(description)) {
    errors.description = "Description field must not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
