import React, { Component } from "react";
import classnames from "classnames";

import ShowAdmins from "./ShowAdmins";
import GroupDescription from "./GroupDescription";

class Settings extends Component {
  state = {
    showDescription: true,
    showAdmin: false
  };

  changeAcitveState = state => {
    switch (state) {
      case "STATE_DESCRIPTION":
        this.setState({
          showDescription: true,
          showAdmin: false
        });
        break;
      case "STATE_ADMIN":
        this.setState({
          showDescription: false,
          showAdmin: true
        });
        break;
      default:
        return;
    }
  };

  render() {
    const { group } = this.props;

    const { showAdmin, showDescription } = this.state;

    const description_class = classnames({
      "list-group-item": true,
      "list-group-item active": showDescription
    });

    return (
      <div className="u-top-space">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className="sidebar-left ml-2">
              <div className="card">
                <div className="card-header">
                  <h2>Settings</h2>
                </div>
                <ul className="list-group list-group-flush">
                  <li
                    className={description_class}
                    onClick={e => this.changeAcitveState("STATE_DESCRIPTION")}
                  >
                    Description
                  </li>
                  <li
                    className="list-group-item"
                    onClick={e => this.changeAcitveState("STATE_ADMIN")}
                  >
                    Admins
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-12">
            <div className="sidebar-right mr-2">
              {showDescription && (
                <GroupDescription description={group.description} />
              )}
              {showAdmin && (
                <div className="container">
                  <div className="row">
                    <ShowAdmins admins={group.admins} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
