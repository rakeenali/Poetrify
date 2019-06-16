const express = require("express");
const isEmpty = require("lodash/isEmpty");

const validateProfile = require("../../validation/profile");
const authenticate = require("../../middleware/authenticate");
const genError = require("../../utils/generateError");
const profileJSON = require("../../utils/profileJSON");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

const router = express.Router();

// @route   GET api/profile
// @desc    Profile of a logged in user
// @access  GET
router.get("", authenticate, async (req, res) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({
      user: req.user._id
    })
      .populate("user")
      .lean()
      .exec();

    if (!profile) {
      errors.message = "User error";
      return genError(res, errors, 400);
    }

    return res.status(200).json(profileJSON(profile));
  } catch (err) {
    return genError(res, err.message);
  }
});

// @route   POST api/profile/:id
// @desc    Get profile of a user by porviding id
// @access  GET
router.get("/:_id", async (req, res) => {
  const { _id } = req.params;
  const errors = {};

  const profile = await Profile.findById(_id).populate(
    "user",
    "email _id name"
  );

  if (!profile) {
    errors.message = "Invalid user id";
    return genError(res, errors);
  }

  return res.status(200).json({ ...profile._doc, _id: profile._id });
});

// @route   POST api/profile/handle/:hanlde
// @desc    Get profile of a user by handle
// @access  GET
router.get("/handle/:handle", async (req, res) => {
  const errors = {};
  const { handle } = req.params;

  const profile = await Profile.findOne({ handle }).populate("user");

  if (!profile) {
    errors.message = "User by this handle does not exist";
    return genError(res, errors);
  }

  return res.status(200).json(profileJSON(profile));
});

// @route   POST api/profile
// @desc    Create user profile or update an existing profile
// @access  POST
router.post("", authenticate, async (req, res) => {
  const { errors, isValid } = validateProfile(req.body);
  if (!isValid) {
    return genError(res, errors);
  }

  try {
    let { handle, firstName, lastName, country, city, dateOfBirth } = req.body;
    city = !isEmpty(city) ? city : "";

    const existProfile = await Profile.findOne({ user: req.user._id });

    if (existProfile) {
      const profile = await Profile.findByIdAndUpdate(
        existProfile._id,
        {
          handle,
          firstName,
          lastName,
          country,
          city,
          dateOfBirth,
          user: req.user._id
        },
        { new: true }
      );

      return res.status(201).json({ profile });
    } else {
      const handleCheck = await Profile.findOne({ handle });
      if (handleCheck) {
        errors.handle = "Handle by this name already exist";
        return genError(res, errors, 409);
      }
      const profile = new Profile({
        handle,
        firstName,
        lastName,
        country,
        city,
        dateOfBirth,
        user: req.user._id
      });
      await profile.save();
      await User.findByIdAndUpdate(req.user._id, { profile: profile._id });

      return res.status(201).json({ profile });
    }
  } catch (e) {
    throw e;
  }
});

module.exports = router;
