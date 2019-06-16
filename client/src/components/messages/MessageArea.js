import React, { Component, Fragment } from "react";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { connect } from "react-redux";
import classname from "classnames";

import Spinner from "../layouts/Loading";

import { sendMessage } from "../../actions/userMessages";

class MessageArea extends Component {
  state = {
    messageText: "",
    error: false
  };
  // Render Functions
  renderMessages = () => {
    const { record, userId } = this.props;
    const last = record.messages.length - 1;
    return record.messages.map((message, index) => {
      let mine = false;
      if (message.from.toString() === userId.toString()) {
        mine = true;
      }

      return (
        <li
          className={classname({
            "list mine": mine,
            "list not-mine": !mine,
            "last-child": index === last
          })}
          key={message._id}
        >
          <p>{message.message}</p>
          <span className="d-block">
            {" "}
            {moment.parseZone(message.messagedAt).fromNow()}
          </span>
        </li>
      );
    });
  };

  // Form function
  sendMessage = userId => {
    const { messageText } = this.state;
    if (messageText.trim() === "") {
      this.setState({ error: true });
      return;
    }
    this.props.sendMessage(messageText, userId);
    this.setState({ messageText: "" });
  };

  render() {
    if (isEmpty(this.props.record.messages)) {
      return <Spinner message={"loading conversation"} />;
    }
    const { record } = this.props;

    return (
      <Fragment>
        <div className="top">
          <h3 className="text-center text-primary">{record.with.name}</h3>
        </div>
        <div className="bottom">
          <ul className="lists">{this.renderMessages()}</ul>
        </div>
        <div className="message">
          <textarea
            value={this.state.messageText}
            className={classname({ error: this.state.error })}
            rows="5"
            onChange={e => this.setState({ messageText: e.target.value })}
          />
          <button onClick={e => this.sendMessage(record.with._id)}>
            Send Message
          </button>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  null,
  { sendMessage }
)(MessageArea);
