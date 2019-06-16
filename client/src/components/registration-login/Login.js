import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Formik, Field } from "formik";

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
        <div className="container u-lg-space">
          <div className="row">
            <div className="col-lg-2 col-md-2 hide-on-small" />
            <div className="col-lg-8 col-md-8 col-12">
              <div className="card text-dark bg-light card-shadow">
                <div className="card-header">
                  <h3 className="text-center">
                    Enter email to receive reset token
                  </h3>
                </div>
                <div className="card-body">
                  {notification.message && (
                    <Alert type="success" message={notification.message} />
                  )}
                  {errors.message && (
                    <Alert type="danger" message={errors.message} />
                  )}
                  <div className="form-container">
                    <Formik
                      initialValues={{ email: "" }}
                      validationSchema={ResetAccountValidaiton}
                      onSubmit={this.onSubmit}
                    >
                      <Form>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Enter Email"
                          label="Enter Email"
                          component={InputForm}
                        />

                        <button
                          type="submit"
                          className="btn btn-outline-info btn-lg"
                        >
                          Reset Account
                        </button>
                        <button
                          type="button"
                          onClick={() => this.setState({ ...initialState })}
                          className="btn btn-link btn-lg text-info"
                        >
                          Go back to Login
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
          <div className="col-lg-2 col-md-2 hide-on-small" />
          <div className="col-lg-8 col-md-8 col-12">
            <div className="card text-dark bg-light card-shadow">
              <div className="card-header">
                <h3 className="text-center">Login</h3>
              </div>
              <div className="card-body">
                {notification.message && (
                  <Alert type="success" message={notification.message} />
                )}
                {errors.message && (
                  <Alert type="danger" message={errors.message} />
                )}
                <div className="form-container">
                  <Formik
                    initialValues={{
                      email: "",
                      password: ""
                    }}
                    onSubmit={this.onSubmit}
                    validationSchema={LoginFormValidation}
                  >
                    <Form>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        label="Enter Email"
                        component={InputForm}
                      />
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        label="Enter Password"
                        component={InputForm}
                      />

                      <button
                        className="btn btn-outline-info btn-lg"
                        type="submit"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          this.setState({
                            ...initialState,
                            forgetPasswordState: true
                          })
                        }
                        className="btn btn-link btn-lg text-info"
                      >
                        Forget Password
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
