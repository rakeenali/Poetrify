import React from "react";
import { connect } from "react-redux";

import { addLike, removeLike } from "../../../actions/like";

function Likes(props) {
  const {
    isAuthenticated,
    likesList,
    userId,
    update,
    poemId,
    addLike,
    removeLike
  } = props;
  let liked = false;

  // if user is not autenticated just show likes count
  if (!isAuthenticated) {
    return (
      <p>
        <span className="btn btn-link btn-disabled">Like: </span>
        <span className="badge badge-primary p-2">{likesList.length}</span>
      </p>
    );
  }

  // define below
  if (isAuthenticated) {
    if (likesList.length > 0) {
      likesList.map(({ likedBy }) => {
        if (likedBy._id === userId) {
          liked = true;
          return;
        }
      });
    }

    if (liked) {
      return (
        <p onClick={e => removeLike(poemId, () => update())}>
          <span className="btn btn-link">Unlike: </span>
          <span className="badge badge-primary p-2">{likesList.length}</span>
        </p>
      );
    } else {
      return (
        <p
          onClick={e =>
            addLike(poemId, () => {
              update();
            })
          }
        >
          <span className="btn btn-link">Like: </span>
          <span className="badge badge-primary p-2">{likesList.length}</span>
        </p>
      );
    }
  }
}

export default connect(
  null,
  { addLike, removeLike }
)(Likes);

// If user is authenticated then first check wether user like the poem
// if user already liked the poem then show unlike button otherwise like button
