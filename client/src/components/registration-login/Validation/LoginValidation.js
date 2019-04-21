import * as Yup from "yup";

export const LoginFormValidation = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email field is required"),
  password: Yup.string()
    .min(4, "Password must be longer than 4 characters")
    .max(11, "Password must be smaller than 11 characters")
    .required("Passowrd field is required")
});

export const ResetAccountValidaiton = Yup.object().shape({
  email: Yup.string()
    .email("Email is not valid")
    .required("Email field is required")
});
