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
    showCommentList: false,
    poem: {}
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPoemById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error.message) {
      this.props.history.push("/");
      return;
    }
    this.setState({ poem: nextProps.poem });
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
    const { isAuthenticated, userId } = this.props;
    const { showCommentList } = this.state;
    const { poem } = this.state;

    if (isEmpty(poem)) {
      return <Loading message="Loading poem please wailt" />;
    }

    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            <div className="poem">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex">
                    <h2 className="card-title d-block">
                      {poem.createdBy.name}
                    </h2>
                    <Dropdown
                      poem={poem}
                      isAuthenticated={isAuthenticated}
                      userId={userId}
                    />
                  </div>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {" "}
                    {moment.parseZone(poem.createdAt).format("DD-MM-YYYY")}
                  </h6>
                  <p className="card-text u-med-para my-2 py-4">
                    {poem.description}
                  </p>
                  <div className="poem-actions">
                    <Likes
                      likesList={poem.likes}
                      poemId={poem._id}
                      userId={userId}
                      isAuthenticated={isAuthenticated}
                      update={e => this.reRender()}
                    />
                    <div
                      className="d-flex align-content-center align-items-center"
                      onClick={e =>
                        this.setState({
                          showCommentList: !this.state.showCommentList
                        })
                      }
                    >
                      <div className="poem-actions-interact">
                        <a href="#!">
                          <span>Comments</span>
                        </a>
                      </div>
                      <div className="poem-actions-count">
                        <span className="badge badge-pill d-block ml-2">
                          {poem.comments.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
