import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import withoutAuth from "../hoc/withoutAuth";
import { resetPassword } from "../../actions/register_login";
import InputForm from "../layouts/InputForm";
import Alert from "../layouts/Alert";

class ResetPassword extends Component {
  state = {
    token: "",
    password: "",
    confirmPassword: "",
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

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const { password, confirmPassword, token } = this.state;

    if (password !== confirmPassword) {
      this.setState({
        errors: { message: "Passwords you enter did no match" }
      });
      return;
    }

    this.props.resetPassword(token, password, this.props.history);
  };

  render() {
    const { token, password, confirmPassword, errors } = this.state;

    if (token) {
      return (
        <div className="container">
          {errors.message && <Alert type="danger" message={errors.message} />}
          <form onSubmit={this.onSubmit}>
            <InputForm
              label="Enter New Password"
              type="password"
              name="password"
              placeholder="Enter new Password"
              value={password}
              onChange={this.onChange}
              error={errors.password}
            />
            <InputForm
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Passwrod"
              value={confirmPassword}
              onChange={this.onChange}
            />
            <button type="submit" className="btn btn-lg btn-outline-info mt-2">
              Reset Password
            </button>
          </form>
        </div>
      );
    }
    return (
      <div>
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
