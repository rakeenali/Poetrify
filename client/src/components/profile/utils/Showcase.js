import React from "react";
import classnames from 'classnames';

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
    'profile__item': true,
    'profile__item--current': currentClass.showPoems
  });

  const followersClass = classnames({
    'profile__item': true,
    'profile__item--current': currentClass.showFollowedBy
  });


  const followingClass = classnames({
    'profile__item': true,
    'profile__item--current': currentClass.showFollowing
  });
  

  return (
    <React.Fragment>
      {image && (
        <div className="profile">
          <img src={image} className="profile--img" alt="Profile image" />
        </div>
      )}
      <div className="profile__nav">
        <div className="profile__column">
          <div className="profile__avatar"></div>
          <div className="profile__sections">
            <div 
              className={poemClass} 
              onClick={showPoems}
            >
              <span>Poems</span>
              <span>  {user.poems.length}</span>
            </div>
            <div 
              className={followersClass}
              onClick={showFollowedBy}
            >
              <span>Followers</span>
              <span>  {user.followedBy.length}</span>
            </div>
            <div 
              className={followingClass}
              onClick={showFollowing}
            >
              <span>Following</span>
              <span>  {user.following.length}</span>
            </div>
          </div>
          <div className="profile__button m-3">
            <button 
              className="btn btn-outline-dark btn-block"
              onClick = {e => changeProfile()}
            > 
              Edit Profile 
            </button>
          </div>
        </div>
      </div>
     
    </React.Fragment>
  );
};
