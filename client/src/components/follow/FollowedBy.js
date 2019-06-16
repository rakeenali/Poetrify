import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Link } from "react-router-dom";
import getImage from "../../utils/getImage";

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
        <div className="col-lg-4 col-md-6 .col-sm-12" key={user._id}>
          <div className="card--container">
            <div className="card--follow">
              <div className="card--side card--side--front">
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
                    <li className="mb-3">
                      Followers{" "}
                      <span className="badge badge-pill card--badge">
                        {" "}
                        {user.followedBy.length}
                      </span>
                    </li>
                    <li>
                      Following{" "}
                      <span className="badge badge-pill card--badge">
                        {user.following.length}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card--side card--side--back card--side--back--img">
                <div className="card--cta">
                  <div className="d-flex flex-column justify-content-center align-content-center">
                    {isAuthenticated && (
                      <button
                        className="btn btn-lg card--btn-follow"
                        onClick={e => this.followUser(user._id)}
                      >
                        Follow
                      </button>
                    )}
                    <Link
                      to={`/profile/${user.profile.handle}`}
                      className="btn btn-lg card--btn-seemore"
                    >
                      See More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div className="col-lg-4 col-md-6 .col-sm-12" key={user._id}>
            <div className="card--container">
              <div className="card--follow">
                <div className="card--side card--side--front">
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
                      <li className="mb-3">
                        Followers{" "}
                        <span className="badge badge-pill card--badge">
                          {" "}
                          {user.followedBy.length}
                        </span>
                      </li>
                      <li>
                        Following{" "}
                        <span className="badge badge-pill card--badge">
                          {user.following.length}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card--side card--side--back card--side--back--img">
                  <div className="card--cta">
                    <div className="d-flex flex-column justify-content-center align-content-center">
                      <button
                        className="btn btn-lg card--btn-follow"
                        onClick={e => this.followUser(user._id)}
                      >
                        Follow
                      </button>
                      <Link
                        to={`/profile/${user.profile.handle}`}
                        className="btn btn-lg card--btn-seemore"
                      >
                        See More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="col-lg-4 col-md-6 col-sm-12" key={user._id}>
          <div className="card--container">
            <div className="card--follow">
              <div className="card--side card--side--front">
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
                    <li className="mb-3">
                      Followers{" "}
                      <span className="badge badge-pill card--badge">
                        {" "}
                        {user.followedBy.length}
                      </span>
                    </li>
                    <li>
                      Following{" "}
                      <span className="badge badge-pill card--badge">
                        {user.following.length}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card--side card--side--back card--side--back--img">
                <div className="card--cta">
                  <div className="d-flex flex-column justify-content-center align-content-center">
                    <button
                      className="btn btn-lg card--btn-follow"
                      onClick={e => this.unFollowUser(user._id)}
                    >
                      Unfollow
                    </button>
                    <Link
                      to={`/profile/${user.profile.handle}`}
                      className="btn btn-lg card--btn-seemore"
                    >
                      See More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
        <React.Fragment>
          {this.renderFollowingMeWithButton(followingMe, following)}
        </React.Fragment>
      );
    }

    if (followingMe.length > 0) {
      return (
        <React.Fragment>
          {this.renderFollowingMe(followingMe, isAuthenticated)}
        </React.Fragment>
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
