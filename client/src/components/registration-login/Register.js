import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import InputForm from "../layouts/InputForm";
import Alert from "../layouts/Alert";
import withoutAuth from "../hoc/withoutAuth";

import { registerUser, resendTokenToEmail } from "../../actions/register_login";
import { clearError } from "../../actions/error";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

  onSubmit = e => {
    e.preventDefault();
    const { name, email, password, confirmPassword, resendToken } = this.state;
    if (resendToken) {
      this.props.resendTokenToEmail(email, this.props.history);
    } else {
      if (password !== confirmPassword) {
        this.setState({ errors: { password: "Passwords did not match" } });
      }
      this.props.registerUser(name, email, password, this.props.history);
    }
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  render() {
    const {
      name,
      email,
      password,
      errors,
      confirmPassword,
      resendToken
    } = this.state;

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
                  <form onSubmit={this.onSubmit}>
                    <InputForm
                      label="Enter Email"
                      type="email"
                      name="email"
                      placeholder="Enter Email"
                      value={email}
                      onChange={this.onChange}
                      error={errors.email}
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
                              name: "",
                              email: "",
                              password: "",
                              confirmPassword: "",
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
                  </form>
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
                <form onSubmit={this.onSubmit}>
                  <InputForm
                    label="Enter Name"
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                  <InputForm
                    label="Enter Email"
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  <InputForm
                    label="Enter Password"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    name="password"
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <InputForm
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={this.onChange}
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
