const isEmpty = require("lodash/isEmpty");
const Validator = require("validator");

module.exports = body => {
  let { title, description } = body;
  let errors = {};

  title = !isEmpty(title) ? title : "";
  description = !isEmpty(description) ? description : "";

  if (!Validator.isLength(title, { min: 4, max: 20 })) {
    errors.title = "Title must be between 4 to 20 charachters";
  }

  if (Validator.isEmpty(title)) {
    errors.title = "Title field must not be empty";
  }

  if (!Validator.isLength(description, { min: 15, max: 100 })) {
    errors.description = "Description must be between 15 to 100 charachters";
  }

  if (Validator.isEmpty(description)) {
    errors.description = "Description field must not be empty";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
