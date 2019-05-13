import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

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
    if (
      nextProps.poemIds[nextProps.poemIds.length - 1] !==
      this.state.poemIds[this.state.poemIds.length - 1]
    ) {
      const { poemIds } = nextProps;
      this.setState({ poemIds });
      nextProps.getManyPoems(poemIds, this.props.sort);
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
        <div className="card" key={poem._id}>
          <div className="card-header">
            <div className="poem__header">
              <div>
                <h5>
                  <Link to={`/poem/${poem._id}`}>{poem.createdBy.name}</Link>
                </h5>
              </div>
              <div className="poem__header--side">
                <div className="d-flex">
                  <span className="text-muted mr-2">
                    {" "}
                    {moment.parseZone(poem.createdAt).format("DD-MM-YYYY")}
                  </span>
                  <span>
                    <Dropdown
                      poem={poem}
                      isAuthenticated={isAuthenticated}
                      userId={userId}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <p className="lead">{poem.description}</p>
          </div>
          <div className="card-footer">
            <div className="poem__footer">
              <React.Fragment>
                <Likes
                  likesList={poem.likes}
                  poemId={poem._id}
                  userId={userId}
                  isAuthenticated={isAuthenticated}
                  update={e => this.reRender()}
                />
              </React.Fragment>
              <p onClick={e => this.setComment(poem._id)}>
                <span className="btn btn-link"> Comments: </span>
                <span className="badge badge-primary p-2">
                  {poem.comments.length}
                </span>
              </p>
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

    if (this.state.loading) {
      return (
        <div className="col-lg-8 col-md-8 col-12 mt-2">
          <Loading message="loading poems" />
        </div>
      );
    }

    if (poems.length > 0) {
      return (
        <div className="col-lg-8 col-md-8 col-12 mt-2">
          {this.renderPoems(poems, isAuthenticated, userId)}
          {this.props.seeMore && (
            <span onClick={this.props.seeMore}>See More</span>
          )}
          {this.props.noSeeMore && <span>Limit Reached</span>}
        </div>
      );
    } else if (isAuthenticated) {
      return (
        <div className="col-8">
          <h3>Add a poem</h3>
          <Link className="btn btn-primary" to="/add-poem">
            Add Poem
          </Link>
        </div>
      );
    }

    return (
      <div className="col-lg-8 col-md-8 col-12 mt-2">
        <h3>User has not written any poem yet</h3>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    poems: state.POEMS,
    isAuthenticated: state.CURRENT_USER.isAuthenticated,
    userId: state.CURRENT_USER._id
  };
};

export default connect(
  mapStateToProps,
  { getManyPoems, clearPoems }
)(ManyPoem);
