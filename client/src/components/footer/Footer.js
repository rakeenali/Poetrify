import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import "./Footer.css";

class Footer extends Component {
  render() {
    if (this.props.location.pathname === "/messages") {
      return <></>;
    }

    return (
      <div className="footer">
        <div className="header">
          <h1>
            Poetrify <span>Final Year Project</span>
          </h1>
        </div>
        <div className="authors">
          <div>
            <h1>Created By</h1>
          </div>
          <div>
            <span>Rakeen Ali</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Footer);
