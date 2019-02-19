import React from "react";
import classnames from "classnames";

export default props => {
  const { type, name, placeholder, value, onChange, label, error } = props;

  const classes = classnames({
    "form-control": true,
    "is-invalid is-invalid-custom": error
  });

  return (
    <div className="mb-3">
      <label className="form-label--white">{label}</label>
      <textarea
        type={type}
        name={name}
        className={classes}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows="5"
      />
      {error && <div className="invalid-feedback invalid-custom">{error}</div>}
    </div>
  );
};
