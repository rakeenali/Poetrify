import React from "react";
import classname from "classnames";

const TextAreaForm = props => {
  const { field, form, type, placeholder, label } = props;
  const { name } = field;
  const { touched, errors } = form;

  const inputClass = classname({
    "form-control form-control-input form-control-red":
      touched[field.name] && errors[field.name],
    "form-control form-control-input": true
  });

  const spanClass = classname({
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
        <textarea
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

export default TextAreaForm;

// import React from "react";
// import PropTypes from "prop-types";
// import { Field, ErrorMessage } from "formik";

// const TextAreaForm = props => {
//   const { type, name, placeholder, label } = props;
//   return (
//     <div className="my-3">
//       <label className="form-label--white">{label}</label>
//       <Field
//         name={name}
//         render={({ field }) => (
//           <textarea
//             {...field}
//             placeholder={placeholder}
//             type={type}
//             className="form-control"
//             rows="5"
//           />
//         )}
//       />
//       <ErrorMessage name={name}>
//         {msg => {
//           return <span className="text-danger">{msg}</span>;
//         }}
//       </ErrorMessage>
//     </div>
//   );
// };

// TextAreaForm.defaultProps = {
//   type: "text"
// };

// TextAreaForm.propTypes = {
//   type: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   placeholder: PropTypes.string.isRequired,
//   label: PropTypes.string.isRequired
// };

// export default TextAreaForm;
// // export default props => {
// //   const { type, name, placeholder, value, onChange, label, error } = props;

// //   return (
// //     <div className="mb-3">
// //       <label className="form-label--white">{label}</label>
// //       <textarea
// //         type={type}
// //         name={name}
// //         className={classes}
// //         placeholder={placeholder}
// //         value={value}
// //         onChange={onChange}
// //         rows="5"
// //       />
// //       {error && <div className="invalid-feedback invalid-custom">{error}</div>}
// //     </div>
// //   );
// // };
