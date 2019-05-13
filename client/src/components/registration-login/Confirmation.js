import React, { Component } from "react";
import { connect } from "react-redux";
import withoutAuth from "../hoc/withoutAuth";

import { confirmUser } from "../../actions/register_login";

import Loading from "../layouts/Loading";

class Confirmation extends Component {
  state = {
    errors: {}
  };

  componentDidMount() {
    const { token } = this.props.match.params;
    this.props.confirmUser(token, this.props.history);
  }

  componentWillReceiveProps(nextProps) {
    const { errors } = nextProps;
    if (errors) {
      this.setState({ errors: { ...errors } });
    }
  }

  render() {
    if (this.state.errors.message) {
      return (
        <div className="container">
          <h2 className="text-danger text-center">
            {this.state.errors.message.toUpperCase()}
          </h2>
        </div>
      );
    }
    return <Loading message="Waiting for email confirmation" />;
  }
}

const mapStateToProps = state => {
  return {
    errors: state.ERROR,
    notifications: state.NOTIFICATION
  };
};

export default connect(
  mapStateToProps,
  { confirmUser }
)(withoutAuth(Confirmation));
