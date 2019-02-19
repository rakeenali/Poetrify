import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import Showcase from "./Showcase";
import Bio from "../profile/utils/Bio";
import ManyPoem from "../poems/poem/ManyPoem";
import FollowedBy from "../follow/FollowedBy";
import Following from "../follow/Following";

import { profileByHandle, clearProfile } from "../../actions/profile";

import Loading from "../layouts/Loading";

const INITIAL_STATE = {
  showFollowedBy: false,
  showPoems: true,
  showFollowing: false
};

class Handle extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.props.profileByHandle(this.props.match.params.handle);
  }

  componentWillReceiveProps(nextProps) {
    const { error, userId, profile } = nextProps;

    if (!isEmpty(error)) {
      this.props.history.push("/");
    }

    if (!isEmpty(profile) && !isEmpty(userId)) {
      if (profile.user.userId.toString() === userId.toString()) {
        this.props.history.push("/");
      }
    }
  }

  componentWillUnmount = () => {
    this.props.clearProfile();
  };

  // Custom functions
  reRender = () => {
    window.location.reload();
  };

  showPoems = () => {
    this.setState({
      showPoems: true,
      showFollowedBy: false,
      showFollowing: false
    });
  };

  showFollowedBy = () => {
    this.setState({
      showPoems: false,
      showFollowedBy: true,
      showFollowing: false
    });
  };

  showFollowing = () => {
    this.setState({
      showPoems: false,
      showFollowedBy: false,
      showFollowing: true
    });
  };

  render() {
    const { profile, isAuthenticated, following } = this.props;
    const { showFollowedBy, showFollowing, showPoems } = this.state;

    if (isEmpty(profile)) {
      return <Loading message="loading profile" />;
    }

    return (
      <React.Fragment>
        <Showcase
          image={profile.profileImage}
          user={profile.user}
          showPoems={this.showPoems}
          showFollowedBy={this.showFollowedBy}
          showFollowing={this.showFollowing}
          following={following}
          isAuthenticated={isAuthenticated}
          reRender={this.reRender}
          currentClass={{
            showPoems,
            showFollowedBy,
            showFollowing
          }}
        />
        <div className="container">
          <div className="row">
            <Bio profile={profile} />
            {showPoems && <ManyPoem poemIds={profile.user.poems} />}
            {showFollowedBy && (
              <FollowedBy
                isAuthenticated={false}
                followedBy={profile.user.followedBy}
                following={profile.user.following}
                reRender={this.reRender}
              />
            )}
            {showFollowing && (
              <Following
                isAuthenticated={false}
                followedBy={profile.user.followedBy}
                following={profile.user.following}
                reRender={this.reRender}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.CURRENT_USER.isAuthenticated,
    userId: state.CURRENT_USER._id,
    error: state.ERROR,
    profile: state.PROFILE,
    following: state.CURRENT_USER_INFO.following
  };
};

export default connect(
  mapStateToProps,
  { profileByHandle, clearProfile }
)(Handle);
