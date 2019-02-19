import React, {
  Component
} from "react";
import isEmpty from "lodash/isEmpty";
import {
  connect
} from "react-redux";
import classnames from 'classnames';

import {
  followUser,
  unFollowUser
} from "../../actions/follow";

class Showcase extends Component {
  followUser = userId => {
    this.props.followUser(userId, () => this.props.reRender());
  };

  unFollowUser = userId => {
    this.props.unFollowUser(userId, () => this.props.reRender());
  };

  followUnFollowButton = (userId, following, isAuthenticated) => {
    let isMatch = false;
    if (!isAuthenticated) {
      return <> </>;
    }

    if (isEmpty(following)) {
      return ( 
        <button 
          className = "btn btn-outline-dark btn-block"
          onClick = {e => this.followUser(userId)} 
        >
          Follow 
        </button>
      );
    }

    following.map(id => {
      if (id === userId) {
        isMatch = true;
      }
    });
    if (isMatch) {
      return ( 
        <button className = "btn btn-outline-dark btn-block"
        onClick = {
          e => this.unFollowUser(userId)
        }>
          Unfollow 
        </button>
      );
    }

    return ( 
      <button className = "btn btn-outline-dark btn-block"
        onClick = {e => this.followUser(userId)} 
      >
        Follow 
      </button>
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
        {
          image && ( 
            <div className = "profile" >
              <img 
                src={image}
                className = "profile--img"
                alt = "Profile image" />
            </div>
          )
        }
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
            {
              this.followUnFollowButton(
                user.userId,
                following,
                isAuthenticated
              )
            }
          </div>
        </div>
      </div>
     </React.Fragment>
    );
  }
}

export default connect(
  null, {
    followUser,
    unFollowUser
  }
)(Showcase);

