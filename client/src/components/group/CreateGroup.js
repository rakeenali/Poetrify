import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import withAuth from "../hoc/withAuth";

import Alert from "../layouts/Alert";

import { createGroup } from "../../actions/group";
import { addGroupImage } from "../../actions/image";

import "./CreateGroup.css";

class CreateGroup extends Component {
  state = {
    title: "",
    description: "",
    image: {},
    label: {},
    showAlert: false
  };

  onSubmit = () => {
    const { title, description, image } = this.state;

    if (title.trim() === "") {
      this.setState({ label: { title: "Title field must not be empty" } });
      return;
    }

    if (title.trim().length <= 4 || title.trim().length >= 20) {
      this.setState({
        label: { title: "Title field must be between 5 to 20 characters" }
      });
      return;
    }

    if (image && image.size > 3000000) {
      this.setState({
        label: { image: "Image size must be smaller than 3 mb" }
      });
      return;
    }

    if (description.trim() === "") {
      this.setState({
        label: { description: "Description field must not be empty" }
      });
      return;
    }

    if (description.trim().length <= 4 || description.trim().length >= 100) {
      this.setState({
        label: {
          description: "Description field must be between 15 to 100 characters"
        }
      });
      return;
    }

    this.setState({ showAlert: true });

    this.props.createGroup({ title, description }, id => {
      this.props.addGroupImage(image, id, () => {
        setTimeout(() => {
          this.props.onClose();
          window.location.reload();
        }, 800);
      });
    });

    return;
  };

  render() {
    const { onClose } = this.props;
    const { label, title, description, showAlert } = this.state;

    const titleClass = classnames({
      "form-control": true,
      "form-control form-control-red": label.title
    });

    const descriptionClass = classnames({
      "form-control": true,
      "form-control form-control-red": label.description
    });

    return (
      <div className="modal-poem">
        <header className="modal-poem-header d-flex justify-content-between align-items-center">
          <h1>Create a group</h1>
          <span className="d-block" onClick={onClose}>
            &times;
          </span>
        </header>
        <section className="container mt-3">
          {showAlert && <Alert type="success" message="Group Created" />}
          <input
            className={titleClass}
            placeholder="Group Title"
            value={title}
            onChange={e => this.setState({ title: e.target.value })}
          />
          {label.title && (
            <div className="form-label">
              <span>{label.title}</span>
            </div>
          )}
          <div className="my-2" />
          <label className="u-small-label">Group Image</label>
          <input
            type="file"
            placeholder="Group Image"
            className="form-control form-control-input"
            accept="image/jpeg, image/png"
            onChange={e => {
              this.setState({ image: e.target.files[0] });
              return;
            }}
          />
          {label.image && (
            <div className="form-label">
              <span>{label.image}</span>
            </div>
          )}
          <div className="my-2" />
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
                    onClick={this.onSubmit}
                  >
                    Create Group
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
  { createGroup, addGroupImage }
)(withAuth(CreateGroup));
