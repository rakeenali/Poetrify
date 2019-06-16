import React, { Component } from "react";
import withAuth from "../hoc/withAuth";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import Loader from "../layouts/Loading";
import _ from "lodash";

import Settings from "./Settings";
import ManyPoem from "../poems/poem/ManyPoem";

import {
  getSingleGroup,
  addMemberToGroup,
  removeMemberFromGroup
} from "../../actions/group";

import Showcase from "./Showcase";
import UserCard from "./UserCard";

class SingleGroup extends Component {
  state = {
    poemIds: [],
    showPoems: true,
    showMembers: false,
    canSeeRequest: false,
    showRequest: false,
    showSettings: false,
    group: {}
  };

  componentDidMount() {
    const { _id } = this.props.match.params;

    if (_id.trim() === "") {
      this.props.history.push("/");
    }

    this.props.getSingleGroup(_id);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if (isEmpty(nextProps.group)) {
      //   this.props.history.push("/profile");
      return;
    }
    nextProps.group.admins.forEach(({ _id }) => {
      if (_id.toString() === nextProps.userId.toString()) {
        this.setState({ canSeeRequest: true });
      }
    });

    let poemIds = nextProps.group.poems.map(({ _id }) => _id);

    this.setState({ group: nextProps.group, poemIds });
  }

  // FUNCTIONS
  showPoems = () =>
    this.setState({
      showPoems: true,
      showRequest: false,
      showMembers: false,
      showSettings: false
    });
  showMembers = () =>
    this.setState({
      showRequest: false,
      showMembers: true,
      showPoems: false,
      showSettings: false
    });
  showRequest = () =>
    this.setState({
      showMembers: false,
      showPoems: false,
      showRequest: true,
      showSettings: false
    });
  showSettings = () =>
    this.setState({
      showMembers: false,
      showPoems: false,
      showRequest: false,
      showSettings: true
    });

  addMember = userId => {
    this.props.addMemberToGroup(this.props.group._id, [userId], () => {
      window.location.reload();
      return;
    });
  };

  removeMember = removeId => {
    this.props.removeMemberFromGroup(this.props.group._id, removeId, () => {
      window.location.reload();
      return;
    });
  };

  // MAIN FUNCTION
  render() {
    const {
      group,
      showPoems,
      showMembers,
      showRequest,
      canSeeRequest,
      poemIds,
      showSettings
    } = this.state;

    const { usersWhoCanJoin } = this.props;

    if (isEmpty(group)) {
      return <Loader message="loading..." />;
    }

    return (
      <>
        <Showcase
          group={group}
          showPoems={this.showPoems}
          showMembers={this.showMembers}
          canSeeRequest={canSeeRequest}
          showRequest={this.showRequest}
          usersWhoCanJoin={usersWhoCanJoin}
          showSettings={this.showSettings}
          currentClass={{
            showPoems,
            showMembers,
            showRequest
          }}
        />
        {showRequest && (
          <UserCard
            canSeeRequest={canSeeRequest}
            users={group.requests}
            buttonTitle="Accept Request"
            onClick={this.addMember}
          />
        )}
        {showMembers && (
          <UserCard
            canSeeRequest={canSeeRequest}
            users={group.members}
            buttonTitle="Remove User"
            onClick={this.removeMember}
          />
        )}
        {showPoems && (
          <div className="container u-top-space">
            <div className="row">
              <div className="col-lg-1 col-md-1">&nbsp;</div>
              <ManyPoem poemIds={poemIds} sort={true} />
            </div>
          </div>
        )}
        {showSettings && <Settings group={group} />}
      </>
    );
  }
}

const mapStateToProps = state => {
  const { GROUP, CURRENT_USER, CURRENT_USER_INFO } = state;

  let usersWhoCanJoin = [];
  if (!_.isEmpty(CURRENT_USER_INFO.followedBy)) {
    usersWhoCanJoin = [...usersWhoCanJoin, ...CURRENT_USER_INFO.followedBy];
  }

  if (!_.isEmpty(CURRENT_USER_INFO.following)) {
    usersWhoCanJoin = [...usersWhoCanJoin, ...CURRENT_USER_INFO.following];
  }

  return {
    group: GROUP.group,
    userId: CURRENT_USER._id,
    usersWhoCanJoin: _.uniq(usersWhoCanJoin)
  };
};

export default connect(
  mapStateToProps,
  { getSingleGroup, addMemberToGroup, removeMemberFromGroup }
)(withAuth(SingleGroup));
