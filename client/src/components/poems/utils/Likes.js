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
      // <p>
      //   <span className="btn btn-link btn-disabled">Like: </span>
      //   <span className="badge badge-primary p-2">{likesList.length}</span>
      // </p>
      <div className="d-flex align-content-center align-items-center">
        <div className="poem-actions-interact">
          <a href="#!">
            <span className="icon">&#x02605;</span>
            <span>Likes</span>
          </a>
        </div>
        <div className="poem-actions-count align-self-end">
          <span className="badge badge-pill d-block ml-2">
            {likesList.length}
          </span>
        </div>
      </div>
    );
  }

  // define below
  if (isAuthenticated) {
    if (likesList.length > 0) {
      likesList.forEach(({ likedBy }) => {
        if (likedBy._id === userId) {
          liked = true;
          return;
        }
      });
    }

    if (liked) {
      return (
        <div
          className="d-flex align-content-center align-items-center liked"
          onClick={e => removeLike(poemId, () => update())}
        >
          <div className="poem-actions-interact">
            <a href="#!">
              <span className="icon">&#x02605;</span>
              <span>Unlike</span>
            </a>
          </div>
          <div className="poem-actions-count align-self-end">
            <span className="badge badge-pill d-block ml-2">
              {likesList.length}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div
          className="d-flex align-content-center align-items-center"
          onClick={e =>
            addLike(poemId, () => {
              update();
            })
          }
        >
          <div className="poem-actions-interact">
            <a href="#!">
              <span className="icon">&#x02606;</span>
              <span>Like</span>
            </a>
          </div>
          <div className="poem-actions-count align-self-end">
            <span className="badge badge-pill d-block ml-2">
              {likesList.length}
            </span>
          </div>
        </div>
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
