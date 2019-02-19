import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";

import Comments from "../utils/Comments";
import Likes from "../utils/Likes";
import Dropdown from "../utils/Dropdown";

import { getMantPoems, clearPoems } from "../../../actions/poems";

import Loading from "../../layouts/Loading";

class ManyPoem extends Component {
  state = {
    showComments: false,
    loading: true
  };

  componentDidMount() {
    const { poemIds } = this.props;
    this.props.getMantPoems(poemIds);
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.props.clearPoems();
  }

  // Callback
  reRender = () => {
    const { poemIds } = this.props;
    this.props.getMantPoems(poemIds);
    this.setState({ showComments: false });
  };

  // Functions
  renderPoems = (poems, isAuthenticated, userId) => {
    const text = [];
    poems.map(poem => {
      text.push(
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
              <p
                onClick={e =>
                  this.setState({ showComments: !this.state.showComments })
                }
              >
                <span className="btn btn-link"> Comments: </span>
                <span className="badge badge-primary p-2">
                  {poem.comments.length}
                </span>
              </p>
            </div>
          </div>
          {this.state.showComments && (
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
    return text;
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
        </div>
      );
    } else if (isAuthenticated) {
      return (
        <div className="col-8">
          <h3>Add a poem</h3>
          <Link className="btn btn-primary" to="/poem-ad">
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
  { getMantPoems, clearPoems }
)(ManyPoem);
