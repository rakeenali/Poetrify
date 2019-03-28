import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";

import { getNotifications } from "../../actions/manageNotifications";

class NotificationButton extends Component {
  state = {
    showCount: true,
    length: null
  };

  componentDidMount() {
    this.props.getNotifications();
  }

  componentWillReceiveProps(nextProps) {
    const { notifications } = nextProps;
    const { length } = this.state;
    if (!isEmpty(notifications)) {
      if (!length) {
        this.setState({
          showCount: true
        });
      } else {
        if (notifications.length === length) {
          this.setState({ showCount: false });
        } else {
          this.setState({ showCount: true });
        }
      }

      this.setState({
        length: notifications.length
      });
    }
  }

  render() {
    const { showCount } = this.state;
    const { notifications } = this.props;

    if (isEmpty(notifications)) {
      return (
        <li classame="nav-item">
          <Link to="/notifications" className="btn btn-outline-secondary">
            Notifications
          </Link>
        </li>
      );
    }

    return (
      <li
        className="nav-item"
        onClick={() => this.setState({ showCount: false })}
      >
        <Link to="/notifications" className="btn button-notification">
          Notifications{" "}
          {showCount && (
            <span className="badge badge-dark">{notifications.unseen}</span>
          )}
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
  { getNotifications }
)(NotificationButton);
