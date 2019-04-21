import React from "react";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";

const InputForm = props => {
  const { type, name, placeholder, label } = props;
  return (
    <div className="form-group">
      <label className="form-label--white">{label}</label>
      <Field
        type={type}
        name={name}
        placeholder={placeholder}
        className="form-control"
      />
      <ErrorMessage name={name}>
        {msg => {
          return <span className="text-danger">{msg}</span>;
        }}
      </ErrorMessage>
    </div>
  );
};

InputForm.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default InputForm;
