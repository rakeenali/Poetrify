import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form } from "formik";

import { addPoem } from "../../../actions/poem";

import withAuth from "../../hoc/withAuth";

import { PoemFormValidation } from "./validation/PoemValidation";
import TextareaForm from "../../layouts/TextareaForm";

class AddPoem extends Component {
  onSubmit = values => {
    this.props.addPoem(values.description, this.props.history);
  };

  render() {
    const { user } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8">
            <div className="card text-white bg-secondary">
              <div className="card-header">
                <h3 className="text-center">
                  {" "}
                  Compose poem as: <strong>{user.name}</strong>
                </h3>
              </div>
              <div className="card-body color-transparent--less">
                <Formik
                  onSubmit={this.onSubmit}
                  initialValues={{ description: "" }}
                  validationSchema={PoemFormValidation}
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
                          Add Poem
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
    user: state.CURRENT_USER
  };
};

export default connect(
  mapStateToProps,
  { addPoem }
)(withAuth(AddPoem));
