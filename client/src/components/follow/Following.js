import React, { Component } from "react";
import { connect } from "react-redux";

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
    let text = [];
    imFollowing.map(user => {
      text.push(
        <div className="profile__follow" key={user._id}>
          <ul className="list-group">
            <li className="list-group-item mt-2">
              <div className="row">
                <div className="col-4 d-flex flex-column justify-content-center">
                  <a href={`/profile/${user.profile.handle}`}>
                    {" "}
                    <h4>{user.name}</h4>
                  </a>
                  {isAuthenticated && (
                    <button
                      className="btn btn-primary btn-md profile__follow--button mt-2"
                      onClick={e => this.unFollowUser(user._id)}
                    >
                      Unfollow
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
      return;
    });
    return text;
  };

  render() {
    const { isAuthenticated, imFollowing } = this.props;

    if (this.state.loading) {
      return <Loading />;
    }

    if (imFollowing.length > 0) {
      return (
        <div className="col-lg-8 col-md-8 col-12">
          {this.renderImFollowing(imFollowing, isAuthenticated)}
        </div>
      );
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
