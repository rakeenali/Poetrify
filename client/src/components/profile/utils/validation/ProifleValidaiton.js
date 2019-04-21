import * as Yup from "yup";

export const ProfileFormValidation = Yup.object().shape({
  firstName: Yup.string().required("First Name Field is required"),
  lastName: Yup.string().required("Last Name Field is required"),
  handle: Yup.string()
    .min(3, "Hanlde field should consist of more than 3 characters")
    .max(11, "Handle filed should be less than 11 characters")
    .required("Handel Field is required"),
  country: Yup.string().required("Country Field is required")
});
