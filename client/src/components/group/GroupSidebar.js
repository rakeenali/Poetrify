import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { Link } from "react-router-dom";

import { getLoggedInGroups, getAllGroups } from "../../actions/group";

class GroupSidebar extends Component {
  state = {
    groups: [],
    noGroups: false
  };

  componentDidMount() {
    const { ownProfile } = this.props;
    if (ownProfile) {
      this.props.getLoggedInGroups();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { groups } = nextProps;
    if (!this.state.noGroups) {
      if (!isEmpty(groups.groupsCreated) || !isEmpty(groups.groupsPartOff)) {
        this.setState({ groups: nextProps.groups });
      } else {
        this.props.getAllGroups();
        this.setState({ noGroups: true });
      }
    } else {
      if (!isEmpty(groups)) {
        this.setState({ groups });
      }
    }
  }

  // FUNCTIONS
  groupsCreated = groups => {
    if (isEmpty(groups)) {
      return <></>;
    }

    return (
      <React.Fragment>
        {groups.map(group => (
          <div className="card bg-dark text-white mb-2" key={group._id}>
            <div className="card-body">
              <h5 className="card-title">{group.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {moment.parseZone(group.createdAt).format("DD-MM-YYYY")}
              </h6>
              <p className="card-text u-small-para">
                {group.description.trim().slice(1, 20)}...
              </p>
              <ul className="list-group">
                <li className="list-group-item active text-dark text-center">
                  <h5>Admin</h5>
                </li>
                <li className="list-group-item text-dark text-center">
                  <h5>
                    Members:{" "}
                    <span className="badge badge-primary">
                      {group.members.length}
                    </span>
                  </h5>
                </li>
                <li className="list-group-item text-dark text-center">
                  <h5>
                    Poems:{" "}
                    <span className="badge badge-primary">
                      {group.poems.length}
                    </span>
                  </h5>
                </li>
                <li className="list-group-item text-dark text-center">
                  <h5>
                    Pending Requests:{" "}
                    <span className="badge badge-primary">
                      {group.requests.length}
                    </span>
                  </h5>
                </li>
              </ul>
              <div className="text-center">
                <Link
                  to={`/group/${group._id}`}
                  className="card-link btn btn-outline-primary btn-sm u-small-para mt-2"
                >
                  More...
                </Link>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  };

  groupsPartOff = (groups, isMember) => {
    if (isEmpty(groups)) {
      return <></>;
    }

    return (
      <React.Fragment>
        {groups.map(group => (
          <div className="card bg-dark text-white mb-2" key={group._id}>
            <div className="card-body">
              <h5 className="card-title">{group.title}</h5>
              <h6 className="card-subtitle mb-2 text-muted">
                {moment.parseZone(group.createdAt).format("DD-MM-YYYY")}
              </h6>
              <p className="card-text u-small-para">
                {group.description.trim().slice(1, 20)}...
              </p>
              <ul className="list-group">
                <li className="list-group-item active text-dark text-center">
                  {isMember ? <h5>Member</h5> : <h5>Join</h5>}
                </li>
                <li className="list-group-item text-dark text-center">
                  <h5>
                    Members:{" "}
                    <span className="badge badge-primary">
                      {group.members.length}
                    </span>
                  </h5>
                </li>
                <li className="list-group-item text-dark text-center">
                  <h5>
                    Poems:{" "}
                    <span className="badge badge-primary">
                      {group.poems.length}
                    </span>
                  </h5>
                </li>
              </ul>
              <div className="text-center">
                <Link
                  to={`/group/${group._id}`}
                  className="card-link btn btn-outline-primary btn-sm u-small-para mt-2"
                >
                  More...
                </Link>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  };

  render() {
    const { groups, noGroups } = this.state;

    if (noGroups) {
      return (
        <div className="mt-3">
          <h3 className="text-center">Groups</h3>
          {this.groupsPartOff(groups, false)}
        </div>
      );
    }

    if (isEmpty(groups)) {
      return <></>;
    }

    return (
      <div className="mt-3">
        <h3 className="text-center">Groups</h3>
        {this.groupsCreated(groups.groupsCreated)}
        {this.groupsPartOff(groups.groupsPartOff, true)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { GROUP } = state;
  return {
    groups: GROUP.groups
  };
};

export default connect(
  mapStateToProps,
  { getLoggedInGroups, getAllGroups }
)(GroupSidebar);
