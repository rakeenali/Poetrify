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
          <li
            key={comment._id}
            className="list-group-item comment__item d-flex justify-content-between"
          >
            <span className="d-inline">
              {comment.description}{" "}
              <span className="d-block text-muted">
                {" "}
                {moment.parseZone(comment.createdAt).format("DD-MM-YYYY")}
              </span>
            </span>
          </li>
        );
      });
    } else {
      return comments.map(comment => {
        return (
          <li
            key={comment._id}
            className="list-group-item comment__item d-flex justify-content-between"
          >
            <span className="d-inline">
              {comment.description}{" "}
              <span className="d-block text-muted">
                {" "}
                {moment.parseZone(comment.createdAt).format("DD-MM-YYYY")}
              </span>
            </span>
            {comment.writtenBy._id === userId && (
              <span
                className="d-inline btn btn-danger btn-sm align-self-center"
                onClick={e =>
                  this.props.deleteComment(poemId, comment._id, () =>
                    this.props.update()
                  )
                }
              >
                Delete
              </span>
            )}
          </li>
        );
      });
    }
  }

  renderUnAuthList = comments => {
    return (
      <>
        {comments.length > 0 && (
          <ul className="list-group">{this.renderCommentList(comments)}</ul>
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
          <ul className="list-group">
            {this.renderCommentList(comments, poemId, userId)}
          </ul>
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
