import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import getImage from "../../utils/getImage";
import { getUsers, clearUsers } from "../../actions/users";
import { followUser, unFollowUser } from "../../actions/follow";

import Loading from "../layouts/Loading";

class Following extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    this.props.getUsers(this.props.following);
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.clearUsers();
  }

  // Custom functions
  unFollowUser = id => {
    this.props.unFollowUser(id, () => this.props.reRender());
  };

  // Custom renders
  renderImFollowing = (imFollowing, isAuthenticated) => {
    return imFollowing.map(user => {
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
                        onClick={e => this.unFollowUser(user._id)}
                      >
                        Unfollow
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

  render() {
    const { isAuthenticated, imFollowing } = this.props;

    if (this.state.loading) {
      return <Loading />;
    }

    if (imFollowing.length > 0) {
      return <>{this.renderImFollowing(imFollowing, isAuthenticated)}</>;
    }

    return <div className="col-lg-8 col-md-8 col-12" />;
  }
}

const mapStatToProps = state => {
  return {
    imFollowing: state.USERS
  };
};

export default connect(
  mapStatToProps,
  { getUsers, clearUsers, unFollowUser, followUser }
)(Following);
