import React from "react";
import PropTypes from "prop-types";
import { Field, ErrorMessage } from "formik";

const TextAreaForm = props => {
  const { type, name, placeholder, label } = props;
  return (
    <div className="my-3">
      <label className="form-label--white">{label}</label>
      <Field
        name={name}
        render={({ field }) => (
          <textarea
            {...field}
            placeholder={placeholder}
            type={type}
            className="form-control"
            rows="5"
          />
        )}
      />
      <ErrorMessage name={name}>
        {msg => {
          return <span className="text-danger">{msg}</span>;
        }}
      </ErrorMessage>
    </div>
  );
};

TextAreaForm.defaultProps = {
  type: "text"
};

TextAreaForm.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export default TextAreaForm;
// export default props => {
//   const { type, name, placeholder, value, onChange, label, error } = props;

//   return (
//     <div className="mb-3">
//       <label className="form-label--white">{label}</label>
//       <textarea
//         type={type}
//         name={name}
//         className={classes}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         rows="5"
//       />
//       {error && <div className="invalid-feedback invalid-custom">{error}</div>}
//     </div>
//   );
// };
