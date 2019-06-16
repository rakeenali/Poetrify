import React from "react";
import classname from "classnames";

const InputForm = props => {
  const { field, form, type, placeholder, label } = props;
  const { name } = field;
  const { touched, errors, isValid } = form;

  const inputClass = classname({
    "form-control form-control-input form-control-success":
      touched[field.name] && isValid,
    "form-control form-control-input form-control-red":
      touched[field.name] && errors[field.name],
    "form-control form-control-input": true
  });

  const spanClass = classname({
    "input-group-text text-input-group success-input-group":
      touched[field.name] && isValid,
    "input-group-text text-input-group error-input-group":
      touched[field.name] && errors[field.name],
    "input-group-text text-input-group": true
  });

  return (
    <div className="form-group mb-4">
      <div className="input-group input-group-lg">
        <div className="input-group-prepend">
          <span className={spanClass}>{label}</span>
        </div>
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className={inputClass}
          {...field}
          {...props}
        />
      </div>
      {errors[field.name] && touched[field.name] && (
        <div className="form-label">
          <span>{errors[field.name]}</span>
        </div>
      )}
    </div>
  );
};

export default InputForm;
