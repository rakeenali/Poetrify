import React from "react";

export default props => {
  const { type, message } = props;
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      {message}
    </div>
  );
};
