import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
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
            <span>Asad Khan</span>
            <span>Ammad Waseem</span>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
