import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import Bio from "./utils/Bio";
import Showcase from "./utils/Showcase";
import CreateProfile from "./CreateProfile";
import ManyPoem from "../poems/poem/ManyPoem";
import FollowedBy from "../follow/FollowedBy";
import GroupSidebar from "../group/GroupSidebar";

import withAuth from "../hoc/withAuth";

import { loggedInProfile, clearProfile } from "../../actions/profile";

import Following from "../follow/Following";

import Loading from "../layouts/Loading";

const INITIAL_STATE = {
  loading: false,
  addProfile: false,
  showFollowedBy: false,
  showPoems: true,
  showFollowing: false
};

class Profile extends Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.setState({ loading: true });
    this.props.loggedInProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile) {
      this.setState({
        loading: false
      });
    }
  }

  componentWillUnmount() {
    this.props.clearProfile();
  }

  // custom functions
  reRender = () => {
    this.setState({ ...INITIAL_STATE });
    this.props.loggedInProfile();
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

  changeProfile = () => {
    this.setState(prevState => ({
      addProfile: !prevState.addProfile
    }));
    this.props.loggedInProfile();
  };

  render() {
    const { profile } = this.props;
    const {
      loading,
      addProfile,
      showPoems,
      showFollowedBy,
      showFollowing
    } = this.state;

    if (loading) {
      return <Loading message={"Loading your profile"} />;
    }

    if (addProfile) {
      return (
        <>
          <CreateProfile changeProfile={this.changeProfile} />
        </>
      );
    }
    if (!isEmpty(profile)) {
      return (
        <React.Fragment>
          <Showcase
            image={profile.profileImage}
            user={profile.user}
            changeProfile={this.changeProfile}
            showPoems={this.showPoems}
            showFollowedBy={this.showFollowedBy}
            showFollowing={this.showFollowing}
            currentClass={{
              showPoems,
              showFollowedBy,
              showFollowing
            }}
          />
          <div className="container u-top-space">
            <div className="row">
              {showPoems && (
                <React.Fragment>
                  <div className="col-lg-4 col-md-4 col-12">
                    <Bio profile={profile} />
                    <GroupSidebar ownProfile={true} />
                  </div>
                  <ManyPoem poemIds={profile.user.poems} />
                </React.Fragment>
              )}
              {showFollowedBy && (
                <FollowedBy
                  isAuthenticated={true}
                  followedBy={profile.user.followedBy}
                  following={profile.user.following}
                  reRender={this.reRender}
                />
              )}
              {showFollowing && (
                <Following
                  isAuthenticated={true}
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

    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-12">
            <h1 className="text-primary display-4">
              Profile has not been created yet
            </h1>
          </div>
          <div className="col-8" />
          <div className="col-2 mt-3">
            <button
              className="btn btn-success btn-block btn-lg"
              onClick={this.changeProfile}
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.ERROR,
    profile: state.PROFILE
  };
};

export default connect(
  mapStateToProps,
  { loggedInProfile, clearProfile }
)(withAuth(Profile));
