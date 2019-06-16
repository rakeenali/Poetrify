import * as Yup from "yup";

export const ChangePasswordValidation = Yup.object().shape({
  oldPassword: Yup.string()
    .min(4, "Password field must be longer than 4 characters")
    .max(11, "Password field must be smaller than 11 characters")
    .required("Password field is required"),
  password: Yup.string()
    .min(4, "Password field must be longer than 4 characters")
    .max(11, "Password field must be smaller than 11 characters")
    .required("Password field is required"),
  confirmPassword: Yup.string()
    .min(4, "Password field must be longer than 4 characters")
    .max(11, "Password field must be smaller than 11 characters")
    .required("Password field is required")
});
