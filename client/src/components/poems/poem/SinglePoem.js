import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import moment from "moment";

import Comments from "../utils/Comments";
import Likes from "../utils/Likes";
import Dropdown from "../utils/Dropdown";

import { getPoemById, clearPoem } from "../../../actions/poem";
import { clearError } from "../../../actions/error";

import Loading from "../../layouts/Loading";

class SinglePoem extends Component {
  state = {
    showCommentList: false
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPoemById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error.message) {
      this.props.history.push("/");
    }
  }

  componentWillUnmount() {
    this.props.clearError();
    this.props.clearPoem();
  }

  reRender = () => {
    const { id } = this.props.match.params;
    this.props.getPoemById(id);
    this.setState({ showCommentList: false });
  };

  render() {
    const { poem, isAuthenticated, userId } = this.props;
    const { showCommentList } = this.state;

    if (isEmpty(poem)) {
      return <Loading message="Loading poem please wailt" />;
    }

    return (
      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between">
              <h4 className="text-muted">
                Written By: <strong>{poem.createdBy.name}</strong>
              </h4>
              <div className="d-flex">
                <span className="text-muted mr-2">
                  {" "}
                  {moment.parseZone(poem.createdAt).format("DD-MM-YYYY")}
                </span>
                <Dropdown
                  poem={poem}
                  isAuthenticated={isAuthenticated}
                  userId={userId}
                />
              </div>
            </div>
          </div>
          <div className="card-body">
            {poem.title && <h4 className="text-center pb-2">{poem.title}</h4>}
            <p className="lead">{poem.description}</p>
            <div className="d-flex justify-content-around">
              <Likes
                likesList={poem.likes}
                poemId={poem._id}
                userId={userId}
                isAuthenticated={isAuthenticated}
                update={e => this.reRender()}
              />
              <p
                onClick={e =>
                  this.setState({
                    showCommentList: !this.state.showCommentList
                  })
                }
              >
                <span className="btn btn-link"> Comments: </span>
                <span className="badge badge-primary p-2">
                  {poem.comments.length}
                </span>
              </p>
            </div>
          </div>

          {showCommentList && (
            <Comments
              commentList={poem.comments}
              poemId={poem._id}
              userId={userId}
              isAuthenticated={isAuthenticated}
              update={e => this.reRender()}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.CURRENT_USER.isAuthenticated,
    userId: state.CURRENT_USER._id,
    error: state.ERROR,
    poem: state.POEM
  };
};

export default connect(
  mapStateToProps,
  { getPoemById, clearError, clearPoem }
)(SinglePoem);
