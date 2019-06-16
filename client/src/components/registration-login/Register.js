import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field } from "formik";

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
        <div className="container u-lg-space">
          <div className="row">
            <div className="col-lg-2 col-md-2 hide-on-small" />
            <div className="col-lg-8 col-md-8 col-12">
              <div className="card text-dark bg-light card-shadow">
                <div className="card-header">
                  <h1 className="text-center">Resend Token</h1>
                </div>
                <div className="card-body">
                  {errors.message && (
                    <Alert type="danger" message={errors.message} />
                  )}
                  <div className="form-container">
                    <Formik
                      initialValues={{ email: "" }}
                      onSubmit={this.onSubmit}
                      validationSchema={ResendTokenValidation}
                    >
                      <Form>
                        <Field
                          label="Enter Email"
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          component={InputForm}
                        />
                        <button
                          className="btn btn-outline-info btn-lg"
                          type="submit"
                        >
                          Resend Token
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            this.setState({
                              resendToken: false,
                              errors: {}
                            })
                          }
                          className="btn btn-link btn-lg text-info"
                        >
                          Go Back
                        </button>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-2 hide-on-small" />
          </div>
        </div>
      );
    }
    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-lg-1 col-md-1 hide-on-small" />
          <div className="col-lg-10 col-md-10 col-12">
            <div className="card text-dark bg-light card-shadow">
              <div className="card-header">
                <h1 className="text-center">Register</h1>
              </div>
              <div className="card-body">
                {errors.message && (
                  <Alert type="danger" message={errors.message} />
                )}
                <div className="form-container">
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
                      <Field
                        label="Enter Name"
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        component={InputForm}
                      />
                      <Field
                        label="Enter Email"
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        component={InputForm}
                      />
                      <Field
                        label="Enter Password"
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        component={InputForm}
                      />
                      <Field
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        component={InputForm}
                      />

                      <button
                        className="btn btn-outline-info btn-lg"
                        type="submit"
                      >
                        Register
                      </button>
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
                        className="btn btn-link btn-lg text-info"
                      >
                        Resend Token
                      </button>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-1 col-md-1 hide-on-small" />
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
