import React, { Component } from "react";
import { connect } from "react-redux";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";

import { getPoemById, updatePoem } from "../../../actions/poem";

import withAuth from "../../hoc/withAuth";

import { PoemFormValidation } from "./validation/PoemValidation";
import TextAreaForm from "../../layouts/TextareaForm";

class UpdatePoem extends Component {
  state = {
    description: ""
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getPoemById(id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ description: nextProps.poem.description });
  }

  onSubmit = values => {
    const { description } = values;
    this.props.updatePoem(
      this.props.match.params.id,
      { description },
      this.props.history
    );
  };

  render() {
    const { user } = this.props;
    const { description } = this.state;

    return (
      <div className="container u-lg-space">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="text-center">
                  {" "}
                  Update poem as: <strong>{user.name}</strong>
                </h3>
              </div>
              <div className="card-body">
                <div className="form-container">
                  <Formik
                    onSubmit={this.onSubmit}
                    initialValues={{ description }}
                    enableReinitialize={true}
                    validationSchema={PoemFormValidation}
                  >
                    <Form>
                      <Field
                        name="description"
                        label="About the poem"
                        placeholder="Poem ..."
                        rows="7"
                        component={TextAreaForm}
                      />
                      <button
                        type="submit"
                        className="btn btn-outline-info btn-lg"
                      >
                        Update Poem
                      </button>
                      <Link className="btn btn-lg btn-link" to="/profile">
                        Cancel
                      </Link>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    poem: state.POEM,
    user: state.CURRENT_USER
  };
};

export default connect(
  mapStateToProps,
  { getPoemById, updatePoem }
)(withAuth(UpdatePoem));
