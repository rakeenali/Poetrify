import React, { Component } from "react";
import classnames from "classnames";

import withAuth from "../hoc/withAuth";
import ChangePassword from "./ChangePassword";
import PrivacyPolicy from "./PrivacyPolicy";

class Settings extends Component {
  state = {
    changePassword: false,
    privacyPolicy: true,
    security: false
  };

  changeAcitveState = state => {
    switch (state) {
      case "CHANGE_PASSWORD":
        this.setState({
          changePassword: true,
          privacyPolicy: false,
          security: false
        });
        break;
      case "PRIVACIY_POLICY":
        this.setState({
          changePassword: false,
          privacyPolicy: true,
          security: false
        });
        break;
      case "SECURITY":
        this.setState({
          changePassword: false,
          privacyPolicy: false,
          security: true
        });
        break;
      default:
        return;
    }
  };

  render() {
    const { changePassword, privacyPolicy, security } = this.state;

    const p_p = classnames({
      "list-group-item": true,
      "list-group-item active": privacyPolicy
    });

    const c_p = classnames({
      "list-group-item": true,
      "list-group-item active": changePassword
    });

    const s_c = classnames({
      "list-group-item": true,
      "list-group-item active": security
    });

    return (
      <div className="u-lg-space">
        <div className="row">
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className="sidebar-left ml-2">
              <div className="card">
                <div className="card-header">
                  <h2>Settings</h2>
                </div>
                <ul className="list-group list-group-flush">
                  <li
                    className={p_p}
                    onClick={e => this.changeAcitveState("PRIVACIY_POLICY")}
                  >
                    Privacy Policy
                  </li>
                  <li
                    className={c_p}
                    onClick={e => this.changeAcitveState("CHANGE_PASSWORD")}
                  >
                    Change Password
                  </li>
                  <li
                    className={s_c}
                    onClick={e => this.changeAcitveState("SECURITY")}
                  >
                    Security
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-12">
            <div className="sidebar-right mr-2">
              {privacyPolicy && <PrivacyPolicy />}
              {changePassword && <ChangePassword />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Settings);
