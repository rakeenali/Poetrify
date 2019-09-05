import React, { Component } from "react";
import { toast } from "react-toastify";
import { connect } from "react-redux";

import { hideToastMessage } from "../../actions/toastNotification";

import "./ToastMessage.css";

class ToastMessage extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.toast.showToast) {
      toast.info(nextProps.toast.message, {
        className: "toast-change"
      });
      setTimeout(() => {
        nextProps.hideToastMessage();
      }, 500);
    }
  }

  render() {
    return <div />;
  }
}

const mapStateToProps = state => {
  return {
    toast: state.TOAST
  };
};

export default connect(
  mapStateToProps,
  { hideToastMessage }
)(ToastMessage);
