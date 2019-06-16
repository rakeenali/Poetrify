import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import moment from "moment";

import { addComment, deleteComment } from "../../../actions/comment";

import "./Comments.css";

class Comments extends Component {
  state = {
    description: "",
    errors: {}
  };

  onSubmit = (poemId, description) => {
    if (!description) {
      this.setState({
        errors: {
          description: "Description field must not be empty"
        }
      });
      return;
    }
    this.props.addComment(poemId, description, () => this.props.update());
  };

  renderCommentList(comments, poemId = null, userId = null) {
    if (!userId) {
      return comments.map(comment => {
        return (
          <div className="comment" key={comment._id}>
            <div className="card">
              <div className="card-title comment-main">
                <div className="d-flex align-items-center align-content-center">
                  <div className="comment-heading">
                    <h5>{comment.writtenBy.name}</h5>
                    <span>{moment.parseZone(comment.createdAt).fromNow()}</span>
                  </div>
                </div>
              </div>
              <div className="comment-hr-div">
                <hr className="comment-hr" />
              </div>
              <div className="card-text px-3 u-small-para comment-text">
                <p>{comment.description}</p>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return comments.map(comment => {
        return (
          <div className="comment" key={comment._id}>
            <div className="card">
              <div className="card-title comment-main">
                <div className="d-flex align-items-center align-content-center">
                  <div className="comment-heading">
                    <h5>{comment.writtenBy.name}</h5>
                    <span>{moment.parseZone(comment.createdAt).fromNow()}</span>
                  </div>
                </div>
                {comment.writtenBy._id === userId && (
                  <div className="dropdown ml-auto">
                    <h4
                      id="commentdropdown"
                      data-toggle="dropdown"
                      className="comment-dropdown"
                    >
                      &#x02026;
                    </h4>
                    <div
                      className="dropdown-menu dropdown-menu-right"
                      aria-labelledby="commentdropdown"
                    >
                      <a
                        className="dropdown-item"
                        href="#!"
                        onClick={e =>
                          this.props.deleteComment(poemId, comment._id, () =>
                            this.props.update()
                          )
                        }
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="comment-hr-div">
                <hr className="comment-hr" />
              </div>
              <div className="card-text px-3  comment-text">
                <p className="u-small-para">{comment.description}</p>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  renderUnAuthList = comments => {
    return (
      <>
        {comments.length > 0 && (
          <React.Fragment>{this.renderCommentList(comments)}</React.Fragment>
        )}
      </>
    );
  };

  renderAuthList = (comments, poemId, userId) => {
    const { description, errors } = this.state;
    return (
      <React.Fragment>
        <div className="comment__form">
          <textarea
            className={classnames({
              "form-control": true,
              "is-invalid is-invalid-custom": errors.description
            })}
            placeholder="Details..."
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            rows="2"
          />
          {errors.description && (
            <div className="invalid-feedback invalid-custom">
              {errors.description}
            </div>
          )}
          <button
            type="button"
            className="btn btn-link btn-sm comment__form--button"
            onClick={e => this.onSubmit(poemId, description)}
          >
            Send
          </button>
        </div>
        {comments.length > 0 && (
          <React.Fragment>
            {this.renderCommentList(comments, poemId, userId)}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  render() {
    const { commentList, userId, isAuthenticated, poemId } = this.props;

    if (!isAuthenticated) {
      return (
        <React.Fragment>{this.renderUnAuthList(commentList)}</React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {this.renderAuthList(commentList, poemId, userId)}
        </React.Fragment>
      );
    }
  }
}

export default connect(
  null,
  { addComment, deleteComment }
)(Comments);
