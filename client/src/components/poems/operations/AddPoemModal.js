import React, { Component } from "react";
import { connect } from "react-redux";
import classnames from "classnames";
import { withRouter } from "react-router-dom";

import { addPoem } from "../../../actions/poem";

import withAuth from "../../hoc/withAuth";

import "./AddPoemModal.css";

class AddPoemModal extends Component {
  state = {
    poemContent: "",
    error: false,
    label: ""
  };

  onSubmit = () => {
    const { poemContent } = this.state;
    if (poemContent.trim() === "") {
      this.setState({ error: true, label: "Poem field must not be empty" });
      return;
    } else if (poemContent.trim().length <= 20) {
      this.setState({
        error: true,
        label: "Poem Description field should be more than 20 characters "
      });
      return;
    } else if (poemContent.trim().length > 1000) {
      this.setState({
        error: true,
        label: "Poem Description field should be less than 1000 characters "
      });
      return;
    }
    this.props.onClose();
    this.props.addPoem(poemContent, this.props.history);
    return;
  };

  render() {
    const { onClose, name } = this.props;
    const { poemContent, error, label } = this.state;
    const textClass = classnames({
      "form-control": !error,
      "form-control form-control-red": error
    });

    return (
      <div className="modal-poem">
        <header className="modal-poem-header d-flex justify-content-between align-items-center">
          <h1>Compose a poem as {name}</h1>
          <span className="d-block" onClick={onClose}>
            &times;
          </span>
        </header>
        <section className="container mt-3">
          <textarea
            placeholder="Add Poem"
            className={textClass}
            rows="7"
            value={poemContent}
            onChange={e => this.setState({ poemContent: e.target.value })}
          />
          {error && (
            <div className="form-label">
              <span>{label}</span>
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
                    Compose
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
  return {
    name: state.CURRENT_USER.name
  };
};

export default connect(
  mapStateToProps,
  { addPoem }
)(withRouter(withAuth(AddPoemModal)));
