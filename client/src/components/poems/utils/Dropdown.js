import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { deletePoem } from "../../../actions/poem";

const Dropdown = props => {
  const { poem, isAuthenticated, userId, deletePoem } = props;

  if (isAuthenticated && poem.createdBy._id === userId) {
    return (
      <div className="dropdown ml-auto">
        <h4 id="poemdropdown" data-toggle="dropdown" className="poem-dropdown">
          &#x02026;
        </h4>
        <div
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby="poemdropdown"
        >
          <Link className="dropdown-item" to={`/update-poem/${poem._id}`}>
            Update Poem
          </Link>
          <button
            className="dropdown-item"
            onClick={() => deletePoem(poem._id)}
          >
            Delete
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
