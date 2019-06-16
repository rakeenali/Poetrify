import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Formik, Form, Field } from "formik";
import { ProfileFormValidation } from "./utils/validation/ProifleValidaiton";

import { clearError } from "../../actions/error";
import { loggedInProfile, addProfile } from "../../actions/profile";
import { addImage } from "../../actions/image";

import InputForm from "../layouts/InputForm";

class CreateProfile extends Component {
  state = {
    firstName: "",
    lastName: "",
    city: "",
    handle: "",
    dateOfBirth: "",
    country: "",
    isNew: true,
    errors: {}
  };

  componentDidMount() {
    this.props.loggedInProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({ errors: { ...nextProps.error } });
    }

    const { profile } = nextProps;
    if (!isEmpty(profile)) {
      const {
        firstName,
        lastName,
        dateOfBirth,
        country,
        city,
        handle
      } = profile;
      this.setState({
        firstName,
        lastName,
        city,
        handle,
        dateOfBirth,
        country,
        isNew: false
      });
    }
  }

  componentWillUnmount() {
    this.props.clearError();
  }

  onSubmit = values => {
    const { image } = this.state;

    if (image && image.size > 3000000) {
      this.setState({
        errors: {
          image: "Size of the image must be smaller than 3 MB"
        }
      });
    } else if (image) {
      this.props.addImage(image);
    }

    const { firstName, lastName, city, country, dateOfBirth, handle } = values;
    this.props.addProfile({
      firstName,
      lastName,
      city,
      country,
      dateOfBirth,
      handle
    });
  };

  render() {
    const { isNew, errors } = this.state;

    let reInit = false;
    let values = {
      firstName: "",
      lastName: "",
      handle: "",
      city: "",
      country: "",
      dateOfBirth: new Date()
    };
    if (!isNew) {
      reInit = true;
      values = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        handle: this.state.handle,
        city: this.state.city,
        country: this.state.country,
        dateOfBirth: new Date()
      };
    }

    return (
      <div>
        <div className="container u-lg-space">
          <div className="row">
            <div className="col-lg-1 hide-on-small">&nbsp;</div>
            <div className="col-lg-10 col-sm-12">
              <div className="card text-dark bg-light card-shadow">
                <div className="card-header">
                  <h1 className="text-center">Manage Profile</h1>
                </div>
                <div className="card-body">
                  <div className="form-container">
                    <Formik
                      onSubmit={this.onSubmit}
                      initialValues={values}
                      enableReinitialize={reInit}
                      validationSchema={ProfileFormValidation}
                    >
                      <Form>
                        <Field
                          type="text"
                          label="Enter First Name"
                          placeholder="First Name"
                          name="firstName"
                          component={InputForm}
                        />
                        <Field
                          type="text"
                          label="Enter Last Name"
                          placeholder="Last Name"
                          name="lastName"
                          component={InputForm}
                        />
                        <Field
                          type="text"
                          label="Enter Your Handle"
                          placeholder="Handle"
                          name="handle"
                          component={InputForm}
                        />
                        {isNew ? (
                          <Field
                            type="date"
                            label="Enter Your Date of birth"
                            placeholder="Date of birth"
                            name="dateOfBirth"
                            component={InputForm}
                          />
                        ) : null}
                        <Field
                          label="Enter Your Country"
                          placeholder="Country"
                          name="country"
                          type="text"
                          component={InputForm}
                        />
                        <Field
                          label="Enter Your City"
                          placeholder="City"
                          name="city"
                          type="text"
                          component={InputForm}
                        />
                        <div className="form-group mb-4">
                          <div className="input-group input-group-lg">
                            <div className="input-group-prepend">
                              <span className="input-group-text text-input-group">
                                Choose Image
                              </span>
                            </div>
                            <input
                              type="file"
                              className="form-control form-control-input"
                              accept="image/jpeg, image/png"
                              onChange={e =>
                                this.setState({ image: e.target.files[0] })
                              }
                            />
                          </div>
                          <span className="help-text u-small-label">
                            {" "}
                            Image must not exceed 3mb and should be of type
                            JPEG, PNG
                          </span>
                          {errors.image && (
                            <div className="form-label">{errors.image}</div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btn btn-outline-info btn-lg"
                        >
                          Update Profile
                        </button>
                        <button
                          className="btn btn-link btn-lg text-info"
                          onClick={e => this.props.changeProfile()}
                        >
                          Go Back
                        </button>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-1 hide-on-small">&nbsp;</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    profile: state.PROFILE,
    error: state.ERROR
  };
};

export default connect(
  mapStateToProps,
  { loggedInProfile, addProfile, clearError, addImage }
)(CreateProfile);
