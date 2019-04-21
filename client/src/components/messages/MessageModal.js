import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import classnames from "classnames";

import { getUsers, clearUsers } from "../../actions/users";
import { sendMessage } from "../../actions/userMessages";

import "./MessageModal.css";

class Modal extends Component {
  state = {
    userIds: [],
    users: null,
    selectedUser: null,
    messageText: "",
    error: null
  };

  componentDidMount() {
    const { userIds } = this.props;
    if (userIds) {
      this.setState({ userIds: _.uniq(userIds) });
      this.props.getUsers(userIds);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.users)) {
      const { users } = nextProps;
      if (!_.isEqual(users, this.state.users)) {
        this.setState({ users });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearUsers();
  }

  // USER_DEFINED_FUNCTIONS

  sendMessage = () => {
    const { messageText } = this.state;
    if (messageText.trim() === "") {
      this.setState({ error: "Message is required" });
      return;
    }
    this.props.sendMessage(messageText, this.state.selectedUser._id);
    this.props.onCancel();
  };

  renderUsersList = () => {
    const { users } = this.state;
    if (!_.isEmpty(users)) {
      return users.map(user => {
        let classes = classnames({
          "list-group-item modal__item": true,
          active: this.state.selectedUser
            ? this.state.selectedUser._id === user._id
            : false
        });
        return (
          <li
            key={user._id}
            className={classes}
            onClick={e => this.setState({ selectedUser: user })}
          >
            {user.name}
          </li>
        );
      });
    }

    return <React.Fragment />;
  };

  render() {
    const { onCancel } = this.props;
    const { selectedUser, messageText, error } = this.state;

    let disabled = selectedUser === null ? true : false;
    let placeholder = !disabled ? `Send Message to ${selectedUser.name}` : "";
    let classes = classnames({
      "form-control": true,
      "is-invalid": error === null ? false : true
    });

    return (
      <div className="modal__main">
        <header className="modal__header d-flex justify-content-between align-items-center">
          <h1>Send Message</h1>
          <span onClick={onCancel}>&times;</span>
        </header>
        <section className="container mt-3">
          <div className="row">
            <div className="col-4">
              <ul className="list-group">{this.renderUsersList()}</ul>
            </div>
            <div className="col-8">
              <div className="form-group">
                <textarea
                  className={classes}
                  value={messageText}
                  onChange={e => this.setState({ messageText: e.target.value })}
                  placeholder={placeholder}
                  rows="7"
                  disabled={disabled}
                />
                {error && <div className="invalid-feedback">{error}</div>}
              </div>
              <button
                className="btn btn-light float-right"
                disabled={disabled}
                onClick={this.sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.USERS
  };
};

export default connect(
  mapStateToProps,
  { getUsers, sendMessage, clearUsers }
)(Modal);
