import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik, Form, Field } from "formik";

import withoutAuth from "../hoc/withoutAuth";
import { resetPassword } from "../../actions/register_login";
import InputForm from "../layouts/InputForm";
import Alert from "../layouts/Alert";

import { ResetPasswordFormValidation } from "./Validation/ResetPasswordValidation";

class ResetPassword extends Component {
  state = {
    token: "",
    errors: {}
  };

  componentDidMount() {
    const { token } = this.props.match.params;
    this.setState({ token });
  }

  componentWillReceiveProps(nextProps) {
    const { error } = nextProps;
    this.setState({ errors: { ...error } });
  }

  onSubmit = values => {
    const { password, confirmPassword } = values;
    const { token } = this.state;

    if (password !== confirmPassword) {
      this.setState({
        errors: { message: "Passwords you enter did no match" }
      });
      return;
    }

    this.props.resetPassword(token, password, this.props.history);
  };

  render() {
    const { token, errors } = this.state;

    if (token) {
      return (
        <div className="container u-lg-space">
          <div className="row">
            <div className="col-lg-2 col-md-2 hide-on-small" />
            <div className="col-lg-8 col-md-8 col-12">
              <div className="card text-dark bg-light card-shadow">
                <div className="card-header">
                  <h3 className="text-center">Reset Password</h3>
                </div>
                <div className="card-body">
                  {errors.message && (
                    <Alert type="danger" message={errors.message} />
                  )}
                  <div className="form-container">
                    <Formik
                      onSubmit={this.onSubmit}
                      initialValues={{ password: "", confirmPassword: "" }}
                      validationSchema={ResetPasswordFormValidation}
                    >
                      <Form>
                        <Field
                          label="Enter New Password"
                          type="password"
                          name="password"
                          placeholder="New Password"
                          component={InputForm}
                        />
                        <Field
                          label="Confirm Password"
                          type="password"
                          name="confirmPassword"
                          placeholder="Confirm Passwrod"
                          component={InputForm}
                        />
                        <button
                          type="submit"
                          className="btn btn-outline-info btn-lg mt-2"
                        >
                          Reset Password
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
        <p>waiting for token</p>
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
  { resetPassword }
)(withoutAuth(withRouter(ResetPassword)));
