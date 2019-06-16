import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";

import withAuth from "../hoc/withAuth";

import { changePassword } from "../../actions/register_login";

import Alert from "../layouts/Alert";
import InputForm from "../layouts/InputForm";
import { ChangePasswordValidation } from "./Validation/ChangePasswordValidation";

class ChangePassword extends Component {
  state = {
    errors: {},
    notification: ""
  };

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: { ...nextProps.errors } });
      return;
    }
    if (!isEmpty(nextProps.notification)) {
      this.setState({
        notification: nextProps.notification.message
      });
      setTimeout(() => {
        this.props.history.push("/profile");
      }, 1000);
    }
  }

  onSubmit = values => {
    const { oldPassword, password, confirmPassword } = values;
    if (password.trim() !== confirmPassword.trim()) {
      this.setState({ errors: { message: "Passwords did not match." } });
      return;
    }
    this.props.changePassword(oldPassword, password);
  };

  render() {
    const { errors, notification } = this.state;
    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-lg-1 col-md-1 hide-on-small">&nbsp;</div>
          <div className="col-lg-10 col-md-10 col-12">
            <div className="card text-dark bg-light card-shadow">
              <div className="card-header">
                <h3 className="text-center">Change Password</h3>
              </div>
              <div className="card-body">
                {errors.message && (
                  <Alert type="danger" message={errors.message} />
                )}
                {notification && (
                  <Alert type="success" message={notification} />
                )}
                <div className="form-container">
                  <Formik
                    initialValues={{
                      oldPassword: "",
                      password: "",
                      confirmPassword: ""
                    }}
                    validationSchema={ChangePasswordValidation}
                    onSubmit={this.onSubmit}
                  >
                    <Form>
                      <Field
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        label="Enter your old password"
                        component={InputForm}
                      />
                      <Field
                        type="password"
                        name="password"
                        placeholder="New Password"
                        label="Enter new password"
                        component={InputForm}
                      />
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        label="Confirm your new password"
                        component={InputForm}
                      />
                      <button
                        className="btn btn-outline-info btn-lg"
                        type="submit"
                      >
                        Change Password
                      </button>
                      <Link className="btn btn-link btn-lg" to="/profile">
                        Cancel
                      </Link>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-1 col-md-1 hide-on-small">&nbsp;</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.ERROR,
    notification: state.NOTIFICATION
  };
};

export default connect(
  mapStateToProps,
  { changePassword }
)(withAuth(ChangePassword));
