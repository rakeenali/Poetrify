import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import { getPoemById, updatePoem } from "../../../actions/poem";
import { clearError } from "../../../actions/error";

import withAuth from "../../hoc/withAuth";

import TextareaForm from "../../layouts/TextareaForm";

class UpdatePoem extends Component {
  state = {
    description: "",
    errors: {}
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPoemById(id);
  }

  componentWillReceiveProps(nextProps) {
    const { error, poem } = nextProps;

    if (!isEmpty(error)) {
      this.setState({ errors: { ...error } });
    } else {
      this.setState({ description: poem.description });
    }
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { description } = this.state;

    this.props.updatePoem(
      this.props.match.params.id,
      { description },
      this.props.history
    );
  };

  render() {
    const { user } = this.props;
    const { description, errors } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8">
            <div className="card text-white bg-secondary">
              <div className="card-header">
                <h3 className="text-center">
                  {" "}
                  Update poem as: <strong>{user.name}</strong>
                </h3>
              </div>
              <div className="card-body color-transparent--less">
                <form onSubmit={this.onSubmit}>
                  <TextareaForm
                    name="description"
                    value={description}
                    label="About the poem"
                    placeholder="Poem ..."
                    onChange={this.onChange}
                    error={errors.description}
                  />

                  <div className="row">
                    <div className="col-lg-4" />
                    <div className="col-lg-4">
                      <button
                        className="btn btn-dark btn-lg btn-block"
                        type="submit"
                      >
                        Update Poem
                      </button>
                    </div>
                    <div className="col-lg-4" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    error: state.ERROR,
    poem: state.POEM,
    user: state.CURRENT_USER
  };
};

export default connect(
  mapStateToProps,
  { getPoemById, updatePoem, clearError }
)(withAuth(UpdatePoem));
