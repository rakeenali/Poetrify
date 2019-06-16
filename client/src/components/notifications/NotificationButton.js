import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";

import { getNotifications } from "../../actions/manageNotifications";

// import BellIcon from "./bell-icon.png";
import BellIconNotification from "./bell-icon-notification.png";

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
        <li className="nav-item nav-img-container mr-2">
          <Link className="nav-link nav-img-link" to="/notifications">
            <img
              className="nav-img"
              src={BellIconNotification}
              alt="bell icon"
            />
            <span className="badge badge-pill nav-img-pill-not">0</span>
          </Link>
        </li>
      );
    }

    if (showCount) {
      return (
        <li
          className="nav-item nav-img-container mr-3"
          onClick={() => this.setState({ showCount: false })}
        >
          <Link to="/notifications" className="nav-img-link">
            <img
              className="nav-img"
              src={BellIconNotification}
              alt="bell icon"
            />
            {showCount && (
              <span className="badge badge-pill nav-img-pill-not">
                {notifications.unseen}
              </span>
            )}
          </Link>
        </li>
      );
    } else if (!showCount) {
      return (
        <li className="nav-item nav-img-container mr-2">
          <Link className="nav-link nav-img-link" to="/notifications">
            <img
              className="nav-img"
              src={BellIconNotification}
              alt="bell icon"
            />
            <span className="badge badge-pill nav-img-pill-not">0</span>
          </Link>
        </li>
      );
    }
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
