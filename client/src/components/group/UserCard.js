import React, { Component } from "react";
import { Link } from "react-router-dom";

import getImage from "../../utils/getImage";

class UserCard extends Component {
  renderUsers = () => {
    const { users, buttonTitle, onClick, canSeeRequest } = this.props;

    return users.map(user => {
      return (
        <div className="col-lg-4 col-md-6 col-sm-12 mt-2" key={user._id}>
          <div className="card--container">
            <div className="card--follow">
              <div className="card--side">
                <div className="card--picture">
                  <img
                    src={getImage(user.profile.profileImage)}
                    alt="users avatar"
                  />
                </div>
                <div className="card--heading">
                  <h4>{user.name}</h4>
                </div>
                <div className="card--details">
                  <ul className="card--list">
                    {canSeeRequest && (
                      <li>
                        <button
                          className="btn btn-success"
                          onClick={e => onClick(user._id)}
                        >
                          {buttonTitle}
                        </button>
                      </li>
                    )}
                    <li>
                      <Link
                        to={`/profile/${user.profile.handle}`}
                        className="btn btn-link btn-lg"
                      >
                        See Profile
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    const { users } = this.props;

    if (users.length <= 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12">
              <h2 className="text-center mt-4">No Pending requests</h2>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        <div className="row">{this.renderUsers()}</div>
      </div>
    );
  }
}

export default UserCard;
