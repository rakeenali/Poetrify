import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { setError } from "../../actions/error";

const withAuth = Component => {
  class WithAuth extends React.Component {
    componentDidMount() {
      const { isAuthenticated } = this.props.user;
      if (!isAuthenticated) {
        this.props.setError("Login is required to access this route");
        this.props.history.push("/login");
      }
    }

    render() {
      const { isAuthenticated } = this.props.user;

      if (isAuthenticated) {
        return <Component {...this.props} />;
      }

      return <></>;
    }
  }

  const mapStateToProps = state => {
    return {
      user: state.CURRENT_USER
    };
  };
  return connect(
    mapStateToProps,
    { setError }
  )(withRouter(WithAuth));
};

export default withAuth;
