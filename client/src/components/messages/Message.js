import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Spinner from "../layouts/Loading";
import moment from "moment";
import classnames from "classnames";

import { getMessages } from "../../actions/userMessages";

import MessageArea from "./MessageArea";

import withAuth from "../hoc/withAuth";
import MessageModal from "./MessageModal";

import NewMessage from "./new-message.png";

class Message extends Component {
  state = {
    records: [],
    loading: false,
    currentRecord: null,
    messageModal: false
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.props.getMessages();
    this.setState({ loading: false });
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.messages)) {
      let records = this.sort(nextProps.messages.records);

      if (this.state.currentRecord) {
        let currentRecord = nextProps.messages.records.filter(record => {
          return (
            record._id.toString() === this.state.currentRecord._id.toString()
          );
        })[0];

        this.setState({ currentRecord, records });
        return;
      }

      this.setState({
        records,
        currentRecord: records[0]
      });
    }
  }

  sort = records => {
    if (records) {
      const sorted = records.sort((a, b) => {
        let aDate = moment(a.messages[a.messages.length - 1].messagedAt);
        let bDate = moment(b.messages[b.messages.length - 1].messagedAt);

        return aDate.isBefore(bDate) ? 1 : -1;
      });

      return sorted;
    }
    return;
  };

  showUser = () => {
    const currentRecordId = this.state.currentRecord.with._id;
    return this.state.records.map(record => {
      return (
        <li
          key={record._id}
          className={classnames({
            "list-group-item list-group-item-custom":
              currentRecordId !== record.with._id,
            "list-group-item list-group-item-custom list-group-item-active":
              currentRecordId === record.with._id
          })}
          onClick={e => this.selectCurrentRecord(record)}
        >
          <div className="user-list">
            <h4>{record.with.name}</h4>
          </div>
        </li>
      );
    });
  };

  selectCurrentRecord(record = null) {
    if (record) {
      this.setState({ currentRecord: record });
    }
  }

  render() {
    const { loading, records, messageModal } = this.state;

    if (loading) {
      return <Spinner message="loading conversations" />;
    }

    if (isEmpty(records) && messageModal) {
      return (
        <MessageModal
          userIds={this.props.userIds}
          onCancel={() => this.setState({ messageModal: false })}
        />
      );
    }

    if (isEmpty(records)) {
      return (
        <div className="messenger">
          <div className="left">
            <div className="top">
              <h3 className="text-center">Recent Messages</h3>
              <img
                src={NewMessage}
                alt="new message"
                onClick={e => this.setState({ messageModal: true })}
              />
            </div>
            <div className="bottom">&nbsp;</div>
          </div>
          <div className="right">
            &nbsp;
            <div className="top">&nbsp;</div>
            <div className="bottom">&nbsp;</div>
          </div>
        </div>
      );
    }

    return (
      <React.Fragment>
        {messageModal && (
          <MessageModal
            userIds={this.props.userIds}
            onCancel={() => this.setState({ messageModal: false })}
          />
        )}
        <div className="messenger">
          <div className="left">
            <div className="top">
              <h3 className="text-center">Recent Messages</h3>
              <img
                src={NewMessage}
                alt="new message"
                onClick={e => this.setState({ messageModal: true })}
              />
            </div>
            <div className="bottom">
              <div className="list-group">{this.showUser()}</div>
            </div>
          </div>
          <div className="right">
            <MessageArea
              record={this.state.currentRecord}
              userId={this.props.currentUserId}
            />
          </div>
          {this.sort()}
        </div>
        {/* <div className="container u-lg-space">
          <div className="row">
            <div className="col-lg-3 col-12">
              <button
                className="btn btn-primary mb-4"
                onClick={e => this.setState({ messageModal: true })}
              >
                New Conversation
              </button>
              <ul>{this.showUser()}</ul>
            </div>
            <div className="col-lg-7 col-12">
              <MessageArea
                record={this.state.currentRecord}
                userId={this.props.currentUserId}
              />
            </div>
            {this.sort()}
          </div>
        </div> */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  let userIds = null;
  if (state.CURRENT_USER_INFO.following) {
    userIds = [
      ...state.CURRENT_USER_INFO.followedBy,
      ...state.CURRENT_USER_INFO.following
    ];
  }
  return {
    messages: state.MESSAGES,
    currentUserId: state.CURRENT_USER._id,
    userIds
  };
};

export default connect(
  mapStateToProps,
  { getMessages }
)(withAuth(Message));
