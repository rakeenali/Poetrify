import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "lodash/isEmpty";
import { Formik, Form } from "formik";
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
        <div className="container">
          <div className="row">
            <div className="col-lg-2" />
            <div className="col-lg-8">
              <div className="card text-white bg-secondary">
                <div className="card-header">
                  <h3 className="text-center">Profile Management</h3>
                </div>
                <div className="card-body color-transparent--less">
                  <Formik
                    onSubmit={this.onSubmit}
                    initialValues={values}
                    enableReinitialize={reInit}
                    validationSchema={!isNew}
                  >
                    <Form>
                      <InputForm
                        type="text"
                        label="Enter First Name"
                        placeholder="First Name"
                        name="firstName"
                      />
                      <InputForm
                        type="text"
                        label="Enter Last Name"
                        placeholder="Last Name"
                        name="lastName"
                      />
                      <InputForm
                        type="text"
                        label="Enter Your Handle"
                        placeholder="Handle"
                        name="handle"
                      />
                      {isNew ? (
                        <InputForm
                          type="date"
                          label="Enter Your Date of birth"
                          placeholder="Date of birth"
                          name="dateOfBirth"
                        />
                      ) : null}
                      <InputForm
                        label="Enter Your Country"
                        placeholder="Country"
                        name="country"
                        type="text"
                      />
                      <InputForm
                        label="Enter Your City"
                        placeholder="City"
                        name="city"
                        type="text"
                      />
                      <div className="form-group">
                        <label className="form-label--white">
                          Profile Image
                        </label>
                        <input
                          type="file"
                          className="form-control-file"
                          accept="image/jpeg, image/png"
                          onChange={e =>
                            this.setState({ image: e.target.files[0] })
                          }
                        />
                        <span className="help-text">
                          Image must not exceed 3mb and should be of type JPEG,
                          PNG
                        </span>
                        {errors.image && (
                          <span className="text-danger d-block">
                            {errors.image}
                          </span>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-lg-4 col-md-4">
                          <button className="btn btn-dark btn-lg">
                            Update Profile
                          </button>
                        </div>
                        <div className="col-lg-8 col-md-8 text-right">
                          <button
                            className="btn btn-outline-dark"
                            onClick={e => this.props.changeProfile()}
                          >
                            Go Back
                          </button>
                        </div>
                      </div>
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
    profile: state.PROFILE,
    error: state.ERROR
  };
};

export default connect(
  mapStateToProps,
  { loggedInProfile, addProfile, clearError, addImage }
)(CreateProfile);
