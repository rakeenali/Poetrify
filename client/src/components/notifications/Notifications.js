import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Loading from "../layouts/Loading";
import { Link } from "react-router-dom";
import classnames from "classnames";
import moment from "moment";

import {
  getNotifications,
  seenNotification
} from "../../actions/manageNotifications";

import "./Notifications.css";

class Notifications extends Component {
  componentDidMount() {
    this.props.getNotifications();
  }

  renderNotification(notification) {
    const classes = classnames({
      "list-group-item notification-item": true,
      "list-group-item-success": !notification.seen
    });
    return (
      <li className={classes} key={notification._id}>
        <h4>{notification.message}</h4>
        <div className="d-flex justify-content-between">
          <span className="text-primary d-block">
            {moment.parseZone(notification.createdAt).fromNow()}
          </span>
          {notification.seen ? (
            <span className="text-secondary d-block">Seen</span>
          ) : (
            <span className="text-secondary d-block">Not seen</span>
          )}
          <span
            className="text-primary d-block"
            onClick={() => this.props.seenNotification(notification._id)}
          >
            <Link to={notification.link}>See more</Link>
          </span>
        </div>
      </li>
    );
  }

  render() {
    const { notifications } = this.props;

    if (isEmpty(notifications)) {
      return <Loading message="loading notifications" />;
    }

    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-md-2" />
          <div className="col-md-8">
            <ul className="list-group">
              {notifications.notifications.reverse().map(notification => {
                return this.renderNotification(notification);
              })}
            </ul>
          </div>
          <div className="col-md-2" />
        </div>
      </div>
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
  { getNotifications, seenNotification }
)(Notifications);
