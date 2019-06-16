import React from "react";
import PropTypes from "prop-types";

const Alert = props => {
  const { type, message } = props;
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      <div className="d-flex align-items-center">
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <span style={{ fontSize: "1.1rem", display: "inline-block" }}>
          {message}
        </span>
      </div>
    </div>
  );
};

Alert.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Alert;
