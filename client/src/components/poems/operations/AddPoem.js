import React, { Component } from "react";
import { connect } from "react-redux";

import { addPoem } from "../../../actions/poem";
import { clearError } from "../../../actions/error";

import withAuth from "../../hoc/withAuth";

import TextareaForm from "../../layouts/TextareaForm";

class AddPoem extends Component {
  state = {
    description: "",
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    this.setState({ errors: { ...error } });
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    const { description } = this.state;
    this.props.addPoem(description, this.props.history);
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
                  Compose poem as: <strong>${user.name}</strong>
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
                        Add Poem
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
    user: state.CURRENT_USER
  };
};

export default connect(
  mapStateToProps,
  { addPoem, clearError }
)(withAuth(AddPoem));
