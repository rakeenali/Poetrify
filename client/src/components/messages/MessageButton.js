import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { clearMessageNotification } from "../../actions/manageNotifications";

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

    return (
      <li className="nav-item ml-2" onClick={this.messageClicked}>
        <Link className="btn btn-outline-warning" to="/messages">
          Messages
          {newMessage && <span className="badge badge-dark">Message</span>}
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
