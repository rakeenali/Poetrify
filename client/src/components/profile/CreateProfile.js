import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from "react-date-picker";
import isEmpty from "lodash/isEmpty";

import { clearError } from "../../actions/error";
import { loggedInProfile, addProfile } from "../../actions/profile";
import { addImage } from "../../actions/image";

import InputForm from "../layouts/InputForm";

class CreateProfile extends Component {
  state = {
    firstName: "",
    lastName: "",
    handle: "",
    city: "",
    country: "",
    dateOfBirth: new Date(),
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

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  onSubmit = e => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      city,
      country,
      dateOfBirth,
      handle,
      image
    } = this.state;

    if (image && image.size > 3000000) {
      console.log("if");
      this.setState({
        errors: {
          image: "Image must be smaller that 3mb"
        }
      });
    } else if (image) {
      this.props.addImage(image);
    }

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
    const {
      firstName,
      lastName,
      city,
      country,
      dateOfBirth,
      errors,
      handle,
      isNew
    } = this.state;

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
                  <form onSubmit={this.onSubmit}>
                    <InputForm
                      label="Enter First Name"
                      placeholder="First Name"
                      name="firstName"
                      value={firstName}
                      onChange={this.onChange}
                      error={errors.firstName}
                    />
                    <InputForm
                      label="Enter Last Name"
                      placeholder="Last Name"
                      name="lastName"
                      value={lastName}
                      onChange={this.onChange}
                      error={errors.lastName}
                    />
                    <InputForm
                      label="Enter Your Handle"
                      placeholder="Handle"
                      name="handle"
                      value={handle}
                      onChange={this.onChange}
                      error={errors.handle}
                    />
                    {isNew ? (
                      <div className="form-group">
                        <label className="form-label--white">
                          Date Of Birth
                        </label>
                        <DatePicker
                          onChange={date =>
                            this.setState({ dateOfBirth: date })
                          }
                          value={dateOfBirth}
                          className="d-block"
                        />
                        {errors.dateOfBirth && (
                          <div className="invalid-feedback invalid-custom">
                            {errors.dateOfBirth}
                          </div>
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <InputForm
                      label="Enter Your Country"
                      placeholder="Country"
                      name="country"
                      value={country}
                      onChange={this.onChange}
                      error={errors.country}
                    />
                    <InputForm
                      label="Enter Your City"
                      placeholder="City"
                      name="city"
                      value={city}
                      onChange={this.onChange}
                      error={errors.city}
                    />
                    <div className="form-group">
                      <label>Profile Image</label>
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
                  </form>
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
