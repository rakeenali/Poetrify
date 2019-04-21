import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";

import { getPoemById, updatePoem } from "../../../actions/poem";

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
    this.setState({ description: nextProps.poem.description });
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = values => {
    const { description } = values;
    this.props.updatePoem(
      this.props.match.params.id,
      { description },
      this.props.history
    );
  };

  render() {
    const { user } = this.props;
    const { description } = this.state;

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
                <Formik
                  onSubmit={this.onSubmit}
                  initialValues={{ description }}
                  enableReinitialize={true}
                >
                  <Form>
                    <TextareaForm
                      name="description"
                      label="About the poem"
                      placeholder="Poem ..."
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
                  </Form>
                </Formik>
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
    poem: state.POEM,
    user: state.CURRENT_USER
  };
};

export default connect(
  mapStateToProps,
  { getPoemById, updatePoem }
)(withAuth(UpdatePoem));
