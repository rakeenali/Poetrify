import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";
import Alert from "../layouts/Alert";
import { withRouter } from "react-router-dom";

import AddMembers from "./AddMembers";
import AddPoemToGroup from "./AddPoemToGroup";

import Backdrop from "../layouts/Backdrop";

import getImage from "../../utils/getImage";

import { sendJoinRequest, deleteGroup, leaveGroup } from "../../actions/group";

class Showcase extends Component {
  state = {
    addMembers: false,
    canSendJoinRequest: true,
    showAlert: false,
    addPoem: false
  };

  componentDidMount() {
    const { group, currentUserId } = this.props;

    group.requests.forEach(({ _id }) => {
      if (_id.toString() === currentUserId.toString()) {
        this.setState({ canSendJoinRequest: false });
      }
    });

    if (this.state.canSendJoinRequest) {
      group.members.forEach(({ _id }) => {
        if (_id.toString() === currentUserId.toString()) {
          this.setState({ canSendJoinRequest: false });
        }
      });
    }

    if (this.state.canSendJoinRequest) {
      group.admins.forEach(({ _id }) => {
        if (_id.toString() === currentUserId.toString()) {
          this.setState({ canSendJoinRequest: false });
        }
      });
    }
  }

  // FUNCTIONS
  closeModal = () => this.setState({ addMembers: false, addPoem: false });

  sendJoinRequest = () => {
    this.props.sendJoinRequest(this.props.group._id, () => {
      this.setState({ showAlert: true });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  deleteGroup = () => {
    this.props.deleteGroup(this.props.group._id, () => {
      this.props.history.push("/profile");
    });
  };

  leaveGroup = () => {
    this.props.leaveGroup(this.props.group._id, () => {
      this.props.history.push("/profile");
    });
  };

  render() {
    const {
      group,
      showPoems,
      showMembers,
      currentClass,
      showSettings,
      showRequest,
      canSeeRequest,
      usersWhoCanJoin
    } = this.props;

    const { addMembers, canSendJoinRequest, showAlert, addPoem } = this.state;

    let groupMembers = [...group.members, ...group.poems, ...group.requests];

    const finalUserList = [];

    usersWhoCanJoin.forEach(joinId => {
      let canAdd = true;
      groupMembers.forEach(({ _id }) => {
        if (_id.toString() === joinId.toString()) {
          canAdd = false;
          return;
        }
      });
      if (canAdd) {
        return finalUserList.push(joinId);
      }
    });

    const poemClass = classnames({
      active: currentClass.showPoems
    });

    const memberClass = classnames({
      active: currentClass.showMembers
    });

    const requestClass = classnames({
      active: currentClass.showRequest
    });

    const imgClass = classnames({
      profile: true,
      "profile group-top-space": !group.groupImage
    });

    return (
      <>
        {addMembers && (
          <>
            <Backdrop />
            <AddMembers
              onClose={this.closeModal}
              usersWhoCanJoin={finalUserList}
              canSeeRequest={canSeeRequest}
              groupId={group._id}
            />
          </>
        )}
        {addPoem && (
          <>
            <Backdrop />
            <AddPoemToGroup onClose={this.closeModal} group={group} />
          </>
        )}
        <div className={imgClass}>
          {group.groupImage && (
            <div className="profile--img">
              <img src={getImage(group.groupImage)} alt="User avatar" />
            </div>
          )}
          {showAlert && (
            <Alert type="success" message="Request sent for approval" />
          )}
          <div className="widget">
            <div className="widget-area">
              <div className="widget-info">
                <div className={poemClass} onClick={showPoems}>
                  <span>Poems</span>
                  <span> {group.poems.length}</span>
                </div>
                <div onClick={showMembers} className={memberClass}>
                  <span>Members</span>
                  <span> {group.members.length}</span>
                </div>
                {canSeeRequest && (
                  <div onClick={showRequest} className={requestClass}>
                    <span>Pending Requests</span>
                    <span> {group.requests.length}</span>
                  </div>
                )}
              </div>
              <div className="widget-name">
                <h4>{group.title}</h4>
              </div>
              <div className="widget-button">
                {canSendJoinRequest ? (
                  <button
                    className="btn btn-lg btn-link"
                    onClick={this.sendJoinRequest}
                  >
                    Join
                  </button>
                ) : (
                  <div className="dropdown">
                    <h4 id="widgetactiondropdown" data-toggle="dropdown">
                      &#x02026;
                    </h4>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="widgetactiondropdown"
                    >
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={e => this.setState({ addPoem: true })}
                      >
                        Add Poem
                      </button>
                      {finalUserList.length >= 1 && (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={e => this.setState({ addMembers: true })}
                        >
                          Add Members
                        </button>
                      )}
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={showSettings}
                      >
                        Details
                      </button>
                      {canSeeRequest ? (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={this.deleteGroup}
                        >
                          Delete Group
                        </button>
                      ) : (
                        <button
                          className="dropdown-item"
                          type="button"
                          onClick={this.leaveGroup}
                        >
                          Leave Group
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  const { CURRENT_USER } = state;
  return {
    currentUserId: CURRENT_USER._id
  };
};

export default connect(
  mapStateToProps,
  { sendJoinRequest, deleteGroup, leaveGroup }
)(withRouter(Showcase));
