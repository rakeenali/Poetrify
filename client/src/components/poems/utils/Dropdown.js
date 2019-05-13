import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { deletePoem } from "../../../actions/poem";

const Dropdown = props => {
  const { poem, isAuthenticated, userId, deletePoem } = props;

  if (isAuthenticated && poem.createdBy._id === userId) {
    return (
      <div className="dropdown align-self-center">
        <button
          className="dropdown-toggle toggle-custom btn btn-link"
          id="poemDropDownMenu"
          data-toggle="dropdown"
        />
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="poemDropDownMenu"
        >
          <Link className="dropdown-item" to={`/update-poem/${poem._id}`}>
            Update Poem
          </Link>
          <button
            className="dropdown-item"
            onClick={() => deletePoem(poem._id)}
          >
            Delete Poem
          </button>
        </div>
      </div>
    );
  }

  return <></>;
};

export default connect(
  null,
  { deletePoem }
)(Dropdown);
