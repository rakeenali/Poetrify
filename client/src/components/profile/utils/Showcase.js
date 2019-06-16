import React from "react";
import classnames from "classnames";

import getImage from "../../../utils/getImage";

export default props => {
  const {
    image,
    user,
    changeProfile,
    showPoems,
    showFollowedBy,
    showFollowing,
    currentClass
  } = props;

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
            <span>{user.email}</span>
          </div>
          <div className="widget-button">
            <div className="dropdown">
              <h4 id="widgetactiondropdown" data-toggle="dropdown">
                &#x02026;
              </h4>
              <div
                className="dropdown-menu"
                aria-labelledby="widgetactiondropdown"
              >
                <button
                  className="dropdown-item"
                  onClick={e => changeProfile()}
                  type="button"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
