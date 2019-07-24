import React from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import getImage from "../../utils/getImage";

import { logout } from "../../actions/register_login";

import NotificationButton from "../notifications/NotificationButton";
import MessageButton from "../messages/MessageButton";

import AddPoemModal from "../poems/operations/AddPoemModal";
import Backdrop from "../layouts/Backdrop";
import CreateGroup from "../group/CreateGroup";
import SearchWindow from "../search/SearchWindow";

class Navbar extends React.Component {
  state = {
    searchTerm: "",
    showPoemModal: false,
    showGroupModal: false,
    showSearchWindow: false
  };

  renderAuthLinks = () => {
    return (
      <React.Fragment>
        <div className="navbar-container">
          <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
            <div className="logo">
              <a href="/">
                <span>Poetrify</span>
              </a>
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <form className="form-inline my-2 my-lg-0 mx-auto">
                <input
                  id="search-input"
                  style={{ width: "35vw" }}
                  value={this.state.searchTerm}
                  autoComplete="off"
                  onChange={e => this.setState({ searchTerm: e.target.value })}
                  className="form-control mr-sm-2"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  onFocus={e => this.setState({ showSearchWindow: true })}
                  onBlur={e => {
                    setTimeout(() => {
                      this.setState({
                        showSearchWindow: false,
                        searchTerm: ""
                      });
                    }, 700);
                  }}
                />
              </form>
              <ul className="navbar-nav ml-auto mr-3">
                <li className="nav-item mr-2 active">
                  <a
                    className="nav-link nav-item-hover"
                    href="#!"
                    onClick={e => this.setState({ showPoemModal: true })}
                  >
                    Add Poem
                  </a>
                </li>
                <NotificationButton />
                <MessageButton />
              </ul>
              <div className="mr-3 avatar">
                <div
                  className="dropdown"
                  id="avatardropdown"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.props.profileImage && (
                    <img
                      className="dropdown-toggle"
                      src={getImage(this.props.profileImage)}
                      alt="User profile"
                    />
                  )}
                  <span className="ml-2 avatar-text">{this.props.name}</span>
                </div>
                <div
                  className="dropdown-menu dropdown-menu-right"
                  aria-labelledby="avatardropdown"
                >
                  <a className="dropdown-item" href="/profile">
                    Profile
                  </a>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      this.setState({ showGroupModal: true });
                    }}
                  >
                    Create Group
                  </button>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      this.props.logout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
        {this.state.showSearchWindow && (
          <>
            <SearchWindow searchTerm={this.state.searchTerm} />
          </>
        )}
        {this.state.showPoemModal && (
          <>
            <Backdrop />
            <AddPoemModal
              onClose={e => this.setState({ showPoemModal: false })}
            />
          </>
        )}
        {this.state.showGroupModal && (
          <>
            <Backdrop />
            <CreateGroup
              onClose={e => this.setState({ showGroupModal: false })}
            />
          </>
        )}
      </React.Fragment>
    );
  };

  renderLinks = () => {
    return (
      <div className="navbar-container">
        <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
          <div className="logo">
            <a href="/">
              <span>Poetrify</span>
            </a>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ml-auto mr-3">
              <li className="nav-item mr-2 active">
                <Link className="nav-link nav-item-hover" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item mr-2 active">
                <Link className="nav-link nav-item-hover" to="/register">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  };

  render() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      return this.renderAuthLinks();
    }
    return this.renderLinks();
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.CURRENT_USER.isAuthenticated,
    name: state.CURRENT_USER.name,
    profileImage: state.CURRENT_USER_INFO.profile
      ? state.CURRENT_USER_INFO.profile.profileImage
      : null
  };
};

export default connect(
  mapStateToProps,
  { logout }
)(withRouter(Navbar));
