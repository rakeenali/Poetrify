import React, { Component } from "react";
import classnames from "classnames";
import { connect } from "react-redux";

import withAuth from "../hoc/withAuth";

import Alert from "../layouts/Alert";

import { addPoemToGroup } from "../../actions/group";

import "./CreateGroup.css";

class AddPoemToGroup extends Component {
  state = {
    description: "",
    label: {},
    showAlert: false
  };

  // FUNCTION
  addPoem = () => {
    const { description } = this.state;

    if (description.trim() === "") {
      this.setState({
        label: { description: "Description field must not be empty" }
      });
      return;
    }
    if (description.trim().length <= 10 || description.trim().length >= 100) {
      this.setState({
        label: {
          description: "Description field must be between 10 to 100 characters"
        }
      });
      return;
    }

    this.props.addPoemToGroup(this.props.group._id, description, () => {
      this.setState({ showAlert: true });
      setTimeout(() => {
        window.location.reload();
      }, 700);
    });
  };

  // RENDER
  render() {
    const { onClose, group } = this.props;
    const { description, label, showAlert } = this.state;

    let descriptionClass = classnames({
      "form-control": true,
      "form-control form-control-red": label.description
    });

    return (
      <div className="modal-poem">
        <header className="modal-poem-header d-flex justify-content-between align-items-center">
          <h1>
            Add Poem to <span className="text-warning">{group.title}</span>
          </h1>
          <span className="d-block" onClick={onClose}>
            &times;
          </span>
        </header>
        <section className="container mt-3">
          {showAlert && (
            <Alert type="success" message="Poem added to the group" />
          )}
          <h4 className="mt-1 mb-2 text-center">Write poem</h4>
          <textarea
            className={descriptionClass}
            placeholder="Description"
            rows="7"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
          />
          {label.description && (
            <div className="form-label">
              <span>{label.description}</span>
            </div>
          )}
          <div className="mt-3">
            <div className="row">
              <div className="col-12">
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-compose mr-2"
                    onClick={this.addPoem}
                  >
                    Add Poem
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

export default connect(
  null,
  { addPoemToGroup }
)(withAuth(AddPoemToGroup));
