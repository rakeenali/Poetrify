import React, { Component } from "react";
import isEmpty from "lodash/isEmpty";
import { connect } from "react-redux";
import classnames from "classnames";

import getImage from "../../utils/getImage";

import { followUser, unFollowUser } from "../../actions/follow";
import { blockUser } from "../../actions/block";

class Showcase extends Component {
  followUser = userId => {
    this.props.followUser(userId, () => this.props.reRender());
  };

  unFollowUser = userId => {
    this.props.unFollowUser(userId, () => this.props.reRender());
  };

  blockUser = userId => {
    this.props.blockUser(userId, () => {
      window.location.href = "/profile";
    });
  };

  followUnFollowButton = (userId, following, isAuthenticated) => {
    let isMatch = false;
    if (!isAuthenticated) {
      return <> </>;
    }

    if (isEmpty(following)) {
      return (
        <div className="dropdown">
          <h4 id="widgetactiondropdown" data-toggle="dropdown">
            &#x02026;
          </h4>
          <div className="dropdown-menu" aria-labelledby="widgetactiondropdown">
            <button
              className="dropdown-item"
              onClick={e => this.followUser(userId)}
              type="button"
            >
              Follow
            </button>
          </div>
        </div>
      );
    }

    following.forEach(id => {
      if (id === userId) {
        isMatch = true;
      }
    });
    if (isMatch) {
      return (
        <div className="dropdown">
          <h4 id="widgetactiondropdown" data-toggle="dropdown">
            &#x02026;
          </h4>
          <div className="dropdown-menu" aria-labelledby="widgetactiondropdown">
            <button
              className="dropdown-item"
              onClick={e => this.unFollowUser(userId)}
              type="button"
            >
              Unfollow
            </button>
            <button
              className="dropdown-item"
              type="button"
              onClick={e => this.blockUser(userId)}
            >
              Block
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="dropdown">
        <h4 id="widgetactiondropdown" data-toggle="dropdown">
          &#x02026;
        </h4>
        <div className="dropdown-menu" aria-labelledby="widgetactiondropdown">
          <button
            className="dropdown-item"
            onClick={e => this.followUser(userId)}
            type="button"
          >
            Follow
          </button>
          <button
            className="dropdown-item"
            type="button"
            onClick={e => this.blockUser(userId)}
          >
            Block
          </button>
        </div>
      </div>
    );
  };

  render() {
    const {
      user,
      showPoems,
      showFollowedBy,
      showFollowing,
      following,
      isAuthenticated,
      image,
      currentClass
    } = this.props;
    const poemClass = classnames({
      active: currentClass.showPoems
    });

    const followersClass = classnames({
      active: currentClass.showFollowedBy
    });

    const followingClass = classnames({
      active: currentClass.showFollowing
    });

    const profileClass = classnames({
      profile: true,
      "profile group-top-space": !image
    });

    return (
      <div className={profileClass}>
        {image && (
          <div className="profile--img">
            <img src={getImage(image)} alt="User avatar" />
          </div>
        )}
        <div className="widget">
          <div className="widget-area">
            <div className="widget-info">
              <div className={poemClass} onClick={showPoems}>
                <span>Poems</span>
                <span> {user.poems.length}</span>
              </div>
              <div className={followersClass} onClick={showFollowedBy}>
                <span>Followers</span>
                <span> {user.followedBy.length}</span>
              </div>
              <div className={followingClass} onClick={showFollowing}>
                <span>Following</span>
                <span> {user.following.length}</span>
              </div>
            </div>
            <div className="widget-name">
              <h4>{user.name}</h4>
              {/* <span>{user.email}</span> */}
            </div>
            <div className="widget-button">
              {this.followUnFollowButton(
                user.userId,
                following,
                isAuthenticated
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {
    followUser,
    unFollowUser,
    blockUser
  }
)(Showcase);
