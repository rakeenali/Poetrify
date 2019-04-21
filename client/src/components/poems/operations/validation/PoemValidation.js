import * as Yup from "yup";

export const PoemFormValidation = Yup.object().shape({
  description: Yup.string()
    .min(20, "Description field should be more than 20 characters")
    .max(1000, "Description field should be less than 1000 characters")
    .required("Description field is required")
});
