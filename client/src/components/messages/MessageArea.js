import React, { Component, Fragment } from "react";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { connect } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import Spinner from "../layouts/Loading";

import TextareaForm from "../layouts/TextareaForm";

import { sendMessage } from "../../actions/userMessages";

import "./MessageArea.css";

const MessageFormValidation = Yup.object().shape({
  messageText: Yup.string()
    .max(500, "Message field should contain less than 500 characters")
    .required("Message Field is required")
});

class MessageArea extends Component {
  // Render Functions
  renderMessages = () => {
    const { record, userId } = this.props;
    console.log(record);
    return record.messages.map(message => {
      let mine = false;
      if (message.from.toString() === userId.toString()) {
        mine = true;
      }
      return (
        <div
          className={
            mine
              ? "bg-primary text-right message-slide"
              : "bg-success message-slide"
          }
          key={message._id}
        >
          <h3>{message.message}</h3>
          <span> {moment.parseZone(message.messagedAt).fromNow()}</span>
        </div>
      );
    });
  };

  // Form function
  sendMessage = (userId, values) => {
    const { messageText } = values;
    this.props.sendMessage(messageText, userId);
    values.messageText = "";
  };

  render() {
    if (isEmpty(this.props.record.messages)) {
      return <Spinner message={"loading conversation"} />;
    }
    const { record } = this.props;

    return (
      <Fragment>
        {this.renderMessages()}
        <Formik
          initialValues={{ messageText: "" }}
          onSubmit={values => this.sendMessage(record.with._id, values)}
          validationSchema={MessageFormValidation}
        >
          <Form>
            <TextareaForm
              name="messageText"
              label="Write a message"
              placeholder={`Reply to ${record.with.name}`}
            />
            <button type="submit" className="btn btn-lg btn-primary">
              Send Message
            </button>
          </Form>
        </Formik>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { sendMessage }
)(MessageArea);
