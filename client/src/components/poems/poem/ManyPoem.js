import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import classname from "classnames";
import isEmpty from "lodash/isEmpty";

import Comments from "../utils/Comments";
import Likes from "../utils/Likes";
import Dropdown from "../utils/Dropdown";

import { getManyPoems, clearPoems } from "../../../actions/poems";

import Loading from "../../layouts/Loading";

class ManyPoem extends Component {
  state = {
    showComments: null,
    loading: false,
    poemIds: []
  };

  componentDidMount() {
    this.setState({ loading: true });
    const { poemIds } = this.props;
    this.setState({ poemIds });
    this.props.getManyPoems(poemIds, this.props.sort);
    this.setState({ loading: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.sort) {
      if (
        nextProps.poemIds[nextProps.poemIds.length - 1] !==
        this.state.poemIds[this.state.poemIds.length - 1]
      ) {
        const { poemIds } = nextProps;
        this.setState({ poemIds });
        nextProps.getManyPoems(poemIds, this.props.sort);
      }
    }
  }

  componentWillUnmount() {
    this.props.clearPoems();
  }

  // Callback
  reRender = () => {
    const { poemIds } = this.props;
    this.props.getManyPoems(poemIds, this.props.sort);
    this.setState({ showComments: null });
  };

  // Functions
  setComment = _id => {
    if (this.state.showComments === _id) {
      this.setState({ showComments: null });
    } else {
      this.setState({ showComments: _id });
    }
  };

  renderPoems = (poems, isAuthenticated, userId) => {
    return poems.map(poem => {
      return (
        <div className="mb-4" key={poem._id}>
          <div className="poem">
            <div className="card">
              <div className="card-body">
                <div className="d-flex">
                  <h2 className="card-title d-block">
                    <Link to={`/poem/${poem._id}`}>{poem.createdBy.name}</Link>
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
                  {/* {poem.description.slice(0, 300)}... */}
                  {/* {poem.description.length} */}
                  {poem.description.length < 300 ? (
                    <>{poem.description}</>
                  ) : (
                    <>
                      {poem.description.slice(0, 300)}
                      <br />
                      <Link
                        to={`/poem/${poem._id}`}
                        style={{ fontWeight: "lighter", fontSize: "1.2rem" }}
                      >
                        Continue Reading...
                      </Link>
                    </>
                  )}
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
                    onClick={e => this.setComment(poem._id)}
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
          {this.state.showComments === poem._id && (
            <Comments
              commentList={poem.comments}
              poemId={poem._id}
              userId={userId}
              isAuthenticated={isAuthenticated}
              update={e => this.reRender()}
            />
          )}
        </div>
      );
    });
  };

  render() {
    const { poems, isAuthenticated, userId } = this.props;
    const classes = classname({
      "col-lg-8 col-md-8 col-12": !this.props.sort,
      "col-lg-10 col-md-10 col-12": this.props.sort
    });

    if (this.state.loading) {
      return (
        <div className="col-lg-8 col-md-8 col-12 mt-2">
          <Loading message="loading poems" />
        </div>
      );
    }

    if (!isEmpty(poems)) {
      return (
        <div className={classes}>
          {this.renderPoems(poems, isAuthenticated, userId)}
          {this.props.seeMore && (
            <div className="text-center mb-4">
              <span
                className="u-small-para see-more"
                onClick={this.props.seeMore}
              >
                See More
              </span>
            </div>
          )}
          {this.props.noSeeMore && <span>Limit Reached</span>}
        </div>
      );
    } else {
      return <div className="col-lg-8 col-md-8 col-12 mt-2" />;
    }
  }
}

const mapStateToProps = state => {
  let poems = state.POEMS;
  if (!(state.POEMS instanceof Array) && !isEmpty(poems)) {
    const newPoems = state.POEMS;
    poems = [];
    for (let i in newPoems) {
      poems.push(newPoems[i]);
    }
  }
  return {
    poems,
    isAuthenticated: state.CURRENT_USER.isAuthenticated,
    userId: state.CURRENT_USER._id
  };
};

export default connect(
  mapStateToProps,
  { getManyPoems, clearPoems }
)(withRouter(ManyPoem));
