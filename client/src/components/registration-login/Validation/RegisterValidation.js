import * as Yup from "yup";

export const RegisterFormValidation = Yup.object().shape({
  name: Yup.string().required("Name Field is required"),
  email: Yup.string()
    .email("Email is not valid")
    .required("Email field is required"),
  password: Yup.string()
    .min(4, "Password must be longer than 4 characters")
    .max(11, "Password must be smaller than 11 characters")
    .required("Passowrd field is required"),
  confirmPassword: Yup.string()
    .min(4, "Confirm Password must be longer than 4 characters")
    .max(11, "Confirm Password must be smaller than 11 characters")
    .required("Confirm Password field is required")
});

export const ResendTokenValidation = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email field is required")
});
