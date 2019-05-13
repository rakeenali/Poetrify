import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { getUsers, clearUsers } from "../../actions/users";
import { followUser, unFollowUser } from "../../actions/follow";

import Loading from "../layouts/Loading";

class FollowedBy extends Component {
  state = {
    loading: false
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.getUsers(this.props.followedBy);
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.clearUsers();
  }

  // Actions
  followUser = id => {
    this.props.followUser(id, () => this.props.reRender());
  };

  unFollowUser = id => {
    this.props.unFollowUser(id, () => this.props.reRender());
  };

  // Custom
  renderFollowingMe = (followingMe, isAuthenticated) => {
    return followingMe.map(user => {
      return (
        <div className="profile__follow" key={user._id}>
          <ul className="list-group">
            <li className="list-group-item mt-2">
              <div className="row">
                <div className="col-4 d-flex flex-column justify-content-center">
                  <a href={`/profile/${user.profile.handle}`}>
                    <h4>{user.name}</h4>
                  </a>
                  {isAuthenticated && (
                    <button
                      className="btn btn-primary btn-md profile__follow--button mt-2"
                      onClick={e => this.followUser(user._id)}
                    >
                      Follow
                    </button>
                  )}
                </div>
                <div className="col-8 d-flex flex-column justify-content-around align-items-end">
                  <span className="profile__follow--text">
                    Following:{" "}
                    <span className="badge badge-info">
                      {user.following.length}
                    </span>
                  </span>
                  <span className="profile__follow--text">
                    Followers:{" "}
                    <span className="badge badge-info">
                      {user.followedBy.length}
                    </span>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      );
    });
  };

  renderFollowingMeWithButton(followingMe, follow) {
    return followingMe.map(user => {
      const result = follow.filter(id => id === user._id);
      if (isEmpty(result)) {
        // show follow button
        return (
          <div className="profile__follow" key={user._id}>
            <ul className="list-group">
              <li className="list-group-item mt-2">
                <div className="row">
                  <div className="col-4 d-flex flex-column justify-content-center">
                    <a href={`/profile/${user.profile.handle}`}>
                      <h4>{user.name}</h4>
                    </a>
                    <button
                      className="btn btn-primary btn-md profile__follow--button mt-2"
                      onClick={e => this.followUser(user._id)}
                    >
                      Follow
                    </button>
                  </div>
                  <div className="col-8 d-flex flex-column justify-content-around align-items-end">
                    <span className="profile__follow--text">
                      Following:{" "}
                      <span className="badge badge-info">
                        {user.following.length}
                      </span>
                    </span>
                    <span className="profile__follow--text">
                      Followers:{" "}
                      <span className="badge badge-info">
                        {user.followedBy.length}
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        );
      }
      return (
        <div className="profile__follow" key={user._id}>
          <ul className="list-group">
            <li className="list-group-item mt-2">
              <div className="row">
                <div className="col-4 d-flex flex-column justify-content-center">
                  <a href={`/profile/${user.profile.handle}`}>
                    <h4>{user.name}</h4>
                  </a>
                  <button
                    className="btn btn-primary btn-md profile__follow--button mt-2"
                    onClick={e => this.unFollowUser(user._id)}
                  >
                    Unfollow
                  </button>
                </div>
                <div className="col-8 d-flex flex-column justify-content-around align-items-end">
                  <span className="profile__follow--text">
                    Following:{" "}
                    <span className="badge badge-info">
                      {user.following.length}
                    </span>
                  </span>
                  <span className="profile__follow--text">
                    Followers:{" "}
                    <span className="badge badge-info">
                      {user.followedBy.length}
                    </span>
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      );
    });
  }

  render() {
    const { isAuthenticated, following, followingMe } = this.props;

    if (this.state.loading) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-8 col-12">
              <Loading />
            </div>
          </div>
        </div>
      );
    }

    if (followingMe.length > 0 && following.length > 0 && isAuthenticated) {
      return (
        <div className="col-lg-8 col-md-8 col-12">
          {this.renderFollowingMeWithButton(followingMe, following)}
        </div>
      );
    }

    if (followingMe.length > 0) {
      return (
        <div className="col-lg-8 col-md-8 col-12">
          {this.renderFollowingMe(followingMe, isAuthenticated)}
        </div>
      );
    }

    return <></>;
  }
}

const mapStatToProps = state => {
  return {
    followingMe: state.USERS
  };
};

export default connect(
  mapStatToProps,
  { getUsers, followUser, unFollowUser, clearUsers }
)(FollowedBy);
