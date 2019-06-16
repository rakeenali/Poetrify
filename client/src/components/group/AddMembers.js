import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import withAuth from "../hoc/withAuth";

import Alert from "../layouts/Alert";

import getImage from "../../utils/getImage";

import { getUsers, clearUsers } from "../../actions/users";
import {
  createGroup,
  addUserRequest,
  addMemberToGroup
} from "../../actions/group";
import { addGroupImage } from "../../actions/image";

import "./CreateGroup.css";
import "./AddMember.css";

class CreateGroup extends Component {
  state = {
    users: [],
    selectedUser: [],
    showAlert: ""
  };

  componentDidMount() {
    if (this.props.usersWhoCanJoin.length >= 1) {
      this.props.getUsers(this.props.usersWhoCanJoin);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length >= 1) {
      this.setState({ users: nextProps.users });
    }
  }

  componentWillUnmount() {
    this.props.clearUsers();
  }

  // FUNCTION

  addSelected = id => {
    if (this.state.selectedUser.includes(id)) {
      this.setState({
        selectedUser: this.state.selectedUser.filter(userid => userid !== id)
      });
    } else {
      this.setState({ selectedUser: [...this.state.selectedUser, id] });
    }
  };

  sendRequest = () => {
    const { selectedUser } = this.state;

    if (selectedUser.length <= 0) {
      this.props.onClose();
      return;
    }

    if (this.props.canSeeRequest) {
      this.props.addMemberToGroup(this.props.groupId, selectedUser, () => {
        this.setState({ showAlert: "Users added" });
        setTimeout(() => {
          this.props.onClose();
          window.location.reload();
        }, 700);
      });
    } else {
      this.props.addUserRequest(this.props.groupId, selectedUser, () => {
        this.setState({ showAlert: "Request sent for approval" });
        setTimeout(() => {
          this.props.onClose();
          window.location.reload();
        }, 700);
      });
    }
  };

  showUser = () => {
    return this.state.users.map(user => {
      let isSelected = this.state.selectedUser.includes(user._id);
      const useClass = classnames({
        "list-group member": true,
        "list-group member member-active": isSelected
      });

      return (
        <div
          key={user._id}
          className={useClass}
          onClick={e => this.addSelected(user._id)}
        >
          <div className="list-group-item">
            {" "}
            <img src={getImage(user.profile.profileImage)} alt="user" />
            <h3>{user.name}</h3>
            {isSelected && (
              <h4 className="badge badge-danger  ml-auto">Selected</h4>
            )}
          </div>
        </div>
      );
    });
  };

  // RENDER
  render() {
    const { onClose, canSeeRequest } = this.props;
    const { users, showAlert } = this.state;
    console.log(this.state);

    return (
      <div className="modal-poem">
        <header className="modal-poem-header d-flex justify-content-between align-items-center">
          <h1>Add Users</h1>
          <span className="d-block" onClick={onClose}>
            &times;
          </span>
        </header>
        <section className="container mt-3">
          {showAlert && <Alert type="success" message={showAlert} />}
          {users.length >= 1 && this.showUser()}
          <div className="mt-3">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-compose mr-2"
                    onClick={this.sendRequest}
                  >
                    {canSeeRequest ? "Add to group" : "Send Request"}
                  </button>
                  <button className="btn  btn-secondary" onClick={onClose}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { USERS } = state;
  return {
    users: USERS
  };
};

export default connect(
  mapStateToProps,
  {
    createGroup,
    addGroupImage,
    getUsers,
    clearUsers,
    addUserRequest,
    addMemberToGroup
  }
)(withAuth(CreateGroup));
