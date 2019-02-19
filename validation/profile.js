const isEmpty = require("lodash/isEmpty");
const Validator = require("validator");

module.exports = body => {
  let { firstName, lastName, country, handle, dateOfBirth } = body;
  let errors = {};

  firstName = !isEmpty(firstName) ? firstName : "";
  lastName = !isEmpty(lastName) ? lastName : "";
  country = !isEmpty(country) ? country : "";
  handle = !isEmpty(handle) ? handle : "";
  dateOfBirth = !isEmpty(dateOfBirth) ? dateOfBirth : "";

  if (!Validator.isLength(firstName, { min: 3, max: 30 })) {
    errors.firstName = "First Name field must be between 3 to 30 characters";
  }

  if (Validator.isEmpty(firstName)) {
    errors.firstName =
      "First Name field is required in order to create a profile";
  }

  if (!Validator.isLength(lastName, { min: 3, max: 30 })) {
    errors.lastName = "Last Name field must be between 3 to 30 characters";
  }

  if (Validator.isEmpty(lastName)) {
    errors.lastName =
      "Last Name field is required in order to create a profile";
  }

  if (Validator.isEmpty(country)) {
    errors.country = "Country field is required in order to create a profile";
  }

  if (!Validator.isLength(handle, { min: 3, max: 30 })) {
    errors.handle = "Handle field must be between 3 to 30 characters";
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = "Handle field is required in order to create a profile";
  }

  if (Validator.isEmpty(dateOfBirth)) {
    errors.dateOfBirth =
      "Date of birth field is required in order to create a profile";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
