import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik, Form } from "formik";

import InputForm from "../layouts/InputForm";
import Alert from "../layouts/Alert";

import {
  RegisterFormValidation,
  ResendTokenValidation
} from "./Validation/RegisterValidation";

import withoutAuth from "../hoc/withoutAuth";

import { registerUser, resendTokenToEmail } from "../../actions/register_login";
import { clearError } from "../../actions/error";

class Register extends Component {
  state = {
    resendToken: false,
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    if (error) {
      this.setState({ errors: error });
    }
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onSubmit = values => {
    const { resendToken } = this.state;
    if (resendToken) {
      this.props.resendTokenToEmail(values.email, this.props.history);
    } else {
      const { name, email, password, confirmPassword } = values;
      if (password.trim() !== confirmPassword.trim()) {
        this.setState({ errors: { message: "Passwords did not match" } });
        return;
      }
      this.props.registerUser(name, email, password, this.props.history);
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const { errors, resendToken } = this.state;

    if (resendToken) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8">
              <div className="card bg-primary text-white">
                <div className="card-header">
                  <h3 className="text-center">Resend Token</h3>
                </div>
                <div className="card-body color-transparent">
                  {errors.message && (
                    <Alert type="danger" message={errors.message} />
                  )}
                  <Formik
                    initialValues={{ email: "" }}
                    onSubmit={this.onSubmit}
                    validationSchema={ResendTokenValidation}
                  >
                    <Form>
                      <InputForm
                        label="Enter Email"
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                      />
                      <div className="row">
                        <div className="col-lg-4" />
                        <div className="col-lg-4">
                          <button
                            className="btn btn-outline-dark btn-lg btn-block"
                            type="submit"
                          >
                            Resend Token
                          </button>
                        </div>
                        <div className="col-lg-4">
                          <button
                            type="button"
                            onClick={() =>
                              this.setState({
                                resendToken: false,
                                errors: {}
                              })
                            }
                            className="btn btn-link btn-lg btn-block"
                          >
                            Go Back
                          </button>
                        </div>
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
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-2" />
          <div className="col-lg-8">
            <div className="card bg-primary text-white">
              <div className="card-header">
                <h3 className="text-center">Register</h3>
              </div>
              <div className="card-body color-transparent">
                {errors.message && (
                  <Alert type="danger" message={errors.message} />
                )}
                <Formik
                  onSubmit={this.onSubmit}
                  initialValues={{
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                  }}
                  validationSchema={RegisterFormValidation}
                >
                  <Form>
                    <InputForm
                      label="Enter Name"
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                    />
                    <InputForm
                      label="Enter Email"
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                    />
                    <InputForm
                      label="Enter Password"
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                    />
                    <InputForm
                      label="Confirm Password"
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                    />

                    <div className="row">
                      <div className="col-lg-4" />
                      <div className="col-lg-4">
                        <button
                          className="btn btn-outline-dark btn-lg btn-block"
                          type="submit"
                        >
                          Register
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          onClick={() =>
                            this.setState({
                              name: "",
                              email: "",
                              password: "",
                              confirmPassword: "",
                              resendToken: true,
                              errors: {}
                            })
                          }
                          className="btn btn-link btn-lg btn-block"
                        >
                          Resend Token
                        </button>
                      </div>
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
    error: state.ERROR
  };
};

export default connect(
  mapStateToProps,
  {
    registerUser,
    resendTokenToEmail,
    clearError
  }
)(withoutAuth(withRouter(Register)));
