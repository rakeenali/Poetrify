import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Formik, withFormik } from "formik";

import withoutAuth from "../hoc/withoutAuth";
import Alert from "../layouts/Alert";
import InputForm from "../layouts/InputForm";
import {
  LoginFormValidation,
  ResetAccountValidaiton
} from "./Validation/LoginValidation";

import { loginUser, forgetPassword } from "../../actions/register_login";
import { clearError } from "../../actions/error";

const initialState = {
  notification: {},
  errors: {},
  forgetPasswordState: false
};

class Login extends Component {
  state = {
    notification: {},
    errors: {},
    forgetPasswordState: false
  };

  componentDidMount() {
    const { notificationFromProps, errorsFromProps } = this.props;
    if (notificationFromProps) {
      this.setState({ notification: { ...notificationFromProps } });
    }
    if (errorsFromProps) {
      this.setState({ errors: { ...errorsFromProps }, password: "" });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { notificationFromProps, errorsFromProps } = nextProps;
    if (notificationFromProps) {
      this.setState({ notification: { ...notificationFromProps } });
    }
    if (errorsFromProps) {
      this.setState({ errors: { ...errorsFromProps }, password: "" });
    }
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = values => {
    const { forgetPasswordState } = this.state;
    if (forgetPasswordState) {
      this.props.forgetPassword(values.email, () =>
        this.setState({ ...initialState })
      );
    } else {
      this.props.loginUser(values.email, values.password);
    }
  };

  render() {
    const {
      notification,

      errors,
      forgetPasswordState
    } = this.state;

    if (forgetPasswordState) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8">
              <div className="card bg-primary text-white">
                <div className="card-header">
                  <h3 className="text-center">
                    Enter Email To Recieve Reset Token
                  </h3>
                </div>
                <div className="card-body color-transparent">
                  {notification.message && (
                    <Alert type="success" message={notification.message} />
                  )}
                  {errors.message && (
                    <Alert type="danger" message={errors.message} />
                  )}
                  <Formik
                    initialValues={{ email: "" }}
                    validationSchema={ResetAccountValidaiton}
                    onSubmit={this.onSubmit}
                  >
                    <Form>
                      <InputForm
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        label="Enter Email"
                      />

                      <div className="row">
                        <div className="col-lg-4" />
                        <div className="col-lg-4">
                          <button
                            type="submit"
                            className="btn btn-outline-dark btn-lg btn-block"
                          >
                            Reset Account
                          </button>
                        </div>
                        <div className="col-lg-4">
                          <button
                            type="button"
                            onClick={() => this.setState({ ...initialState })}
                            className="btn btn-link btn-lg btn-block"
                          >
                            Go back to Login
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
                <h3 className="text-center">Login</h3>
              </div>
              <div className="card-body color-transparent">
                {notification.message && (
                  <Alert type="success" message={notification.message} />
                )}
                {errors.message && (
                  <Alert type="danger" message={errors.message} />
                )}
                <Formik
                  initialValues={{
                    email: "",
                    password: ""
                  }}
                  onSubmit={this.onSubmit}
                  validationSchema={LoginFormValidation}
                >
                  <Form>
                    <InputForm
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      label="Enter Email"
                    />
                    <InputForm
                      type="password"
                      name="password"
                      placeholder="Enter Password"
                      label="Enter Password"
                    />

                    <div className="row">
                      <div className="col-lg-4" />
                      <div className="col-lg-4">
                        <button
                          className="btn btn-outline-dark btn-lg btn-block"
                          type="submit"
                        >
                          Login
                        </button>
                      </div>
                      <div className="col-lg-4">
                        <button
                          type="button"
                          onClick={() =>
                            this.setState({
                              ...initialState,
                              forgetPasswordState: true
                            })
                          }
                          className="btn btn-link btn-lg btn-block"
                        >
                          Forget Password
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
    notificationFromProps: state.NOTIFICATION,
    errorsFromProps: state.ERROR
  };
};

export default connect(
  mapStateToProps,
  { loginUser, forgetPassword, clearError }
)(withoutAuth(Login));
