import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { clearMessageNotification } from "../../actions/manageNotifications";

import MessageIcon from "./msg-icon.png";
import MessageIconNew from "./msg-icon-notification.png";

class MessageButton extends Component {
  state = {
    newMessage: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.notifications.newMessage) {
      this.setState({ newMessage: true });
    } else if (nextProps.notifications.newMessage === this.state.newMessage) {
      this.setState({ newMessage: false });
    }
  }

  messageClicked = () => {
    this.props.clearMessageNotification();
    this.setState({ newMessage: false });
  };

  render() {
    const { newMessage } = this.state;

    if (newMessage) {
      return (
        <li
          className="nav-item nav-img-container mr-3"
          onClick={this.messageClicked}
        >
          <Link className="nav-link nav-img-link" to="/messages">
            <img
              className="nav-img"
              src={MessageIconNew}
              alt="new message recieved"
            />
            <span className="badge badge-pill nav-img-pill-msg">msg</span>
          </Link>
        </li>
      );
    }

    return (
      <li className="nav-item nav-img-container mr-2">
        <Link className="nav-link nav-img-link" to="/messages">
          <img className="nav-img" src={MessageIcon} alt="message" />
        </Link>
      </li>
    );
  }
}

const mapStateToProps = state => {
  return {
    notifications: state.USER_NOTIFICATION
  };
};

export default connect(
  mapStateToProps,
  { clearMessageNotification }
)(withRouter(MessageButton));
