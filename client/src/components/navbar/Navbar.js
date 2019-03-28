import React from "react";
import { withRouter, NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../../actions/register_login";

import NotificationButton from "../notifications/NotificationButton";

import "./Navbar.css";

class Navbar extends React.Component {
  renderAuthLinks = () => {
    return (
      <nav className="navbar navbar-expand-md navbar-color">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-collapse"
        >
          <span>-</span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
          </ul>
          <ul className="navbar-nav d-flex align-items-center">
            <li className="nav-item">
              <NavLink exact={true} className="nav-link" to="/add-poem">
                Add Poem
              </NavLink>
            </li>
            <NotificationButton />
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="dropdown-menu"
                role="button"
                data-toggle="dropdown"
              />
              <div
                className="dropdown-menu dropdown-menu-right"
                aria-labelledby="dropdown-menu"
              >
                <Link className="dropdown-item" to="/profile">
                  My Profile
                </Link>
                <button
                  className="dropdown-item btn btn-link"
                  onClick={() => this.props.logout()}
                >
                  Logout
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  renderLinks = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-color">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbar-collapse"
        >
          <span>-</span>
        </button>

        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="/">
                Home
              </a>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/register">
                Register
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    );
  };

  render() {
    console.log();
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return this.renderAuthLinks();
    }
    return this.renderLinks();
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.CURRENT_USER.isAuthenticated
});

export default connect(
  mapStateToProps,
  { logout }
)(withRouter(Navbar));
