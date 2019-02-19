import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const withoutAuth = Component => {
  class WithoutAuth extends React.Component {
    componentDidMount() {
      const { isAuthenticated } = this.props.user;
      if (isAuthenticated) {
        this.props.history.push("/profile");
      }
    }

    render() {
      const { isAuthenticated } = this.props.user;

      if (!isAuthenticated) {
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
  return connect(mapStateToProps)(withRouter(WithoutAuth));
};

export default withoutAuth;
