import * as Yup from "yup";

export const ResetPasswordFormValidation = Yup.object().shape({
  password: Yup.string()
    .min(4, "Password must be longer than 4 characters")
    .max(11, "Password must be smaller than 11 characters")
    .required("Passowrd field is required"),
  confirmPassword: Yup.string()
    .min(4, "Confirm Password must be longer than 4 characters")
    .max(11, "Confirm Password must be smaller than 11 characters")
    .required("Confirm Password field is required")
});
