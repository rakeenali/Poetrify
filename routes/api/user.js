const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const keys = require("../../config/keys");
const authenticate = require("../../middleware/authenticate");
const generateError = require("../../utils/generateError");
const User = require("../../models/User");

const validateRegister = require("../../validation/register");
const validateLogin = require("../../validation/login");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: keys.nodeMailerUser,
    pass: keys.nodeMailerPassword
  },
  tls: {
    rejectUnauthorized: false
  }
});

const router = express.Router();

// When Delete user delete everything related to him

// @route   POST api/user/current
// @desc    Get current logged in user
// @access  GET
router.get("/current", authenticate, async (req, res) => {
  const errors = {};

  const user = await User.findById(req.user._id);

  if (!user) {
    errors.message = "User error";
    return genError(res, errors, 400);
  }

  return res.status(200).json({
    ...user._doc,
    password: null
  });
});

// @route   POST api/user/users
// @desc    Get many user by id
// @access  POST
router.post("/users", async (req, res) => {
  try {
    const { userIds } = req.body;
    console.log(typeof userIds);
    const users = await User.find({
      _id: { $in: userIds }
    }).populate("profile", "_id handle");

    return res.status(200).json(
      users.map(user => ({
        _id: user.id,
        name: user.name,
        following: user.following,
        followedBy: user.followedBy,
        profile: {
          _id: user.profile._id,
          handle: user.profile.handle
        }
      }))
    );
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/register
// @desc    Register user send verifcation token
// @access  POST
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    return generateError(res, errors);
  }

  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      errors.message = "Email already exist";
      return generateError(res, errors, 409);
    }

    const user = new User({ name, email, password });
    await user.save();
    const emailToken = await jwt.sign({ _id: user._id }, keys.emailSecret, {
      expiresIn: "1d"
    });
    const host = req.get("host");
    console.log(host);
    const url = `http://${host}/confirmation/${emailToken}`;
    transporter.sendMail({
      to: user.email,
      subject: "Confirm email",
      html: `Please click this link to confirm your email: <a href=${url}>${url}</a>`
    });
    res
      .status(201)
      .json({ message: `A verfication token has been sent ${user.email}` });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/login
// @desc    Login user
// @access  POST
router.post("/login", async (req, res) => {
  const { errors, isValid } = validateLogin(req.body);

  if (!isValid) {
    return generateError(res, errors);
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      errors.message = "Invalid email or password";
      return generateError(res, errors);
    }

    if (!user.isVerifed) {
      errors.message = `You email ${user.email} has not been verified yet`;
      return generateError(res, errors);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      errors.message = "Invalid email or password";
      return generateError(res, errors);
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, keys.tokenSecret, { expiresIn: 3600 });

    return res.status(200).json({ token });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/confirmation
// @desc    Verify user email address
// @access  GET
router.get("/confirmation/:token", async (req, res) => {
  try {
    let errors = {};
    const { token } = req.params;
    const decodedToken = jwt.verify(token, keys.emailSecret);

    if (!decodedToken) {
      errors.message = "Email not verified";
      return generateError(res, errors);
    }

    if (decodedToken.exp < Date.now() / 1000) {
      errors.message = "Email not verified";
      return generateError(res, errors);
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      errors.message = "User by this email may be deleted or try again later";
      return generateError(res, errors);
    }

    if (user.isVerifed) {
      errors.message = "You are already verified";
      return generateError(res, errors);
    }

    await User.findByIdAndUpdate(user._id, { isVerifed: true });
    return res
      .status(200)
      .json({ message: "Your email has been verified you can now login" });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/resendtoken
// @desc    Send verifcaiton token again
// @access  POST
router.post("/resendtoken", async (req, res) => {
  const { email } = req.body;
  let errors = {};

  if (!email) {
    errors.email = "Email field is required";
    return generateError(res, errors);
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.message = "Email that you enter does not exist";
      return generateError(res, errors);
    }

    const emailToken = await jwt.sign({ _id: user._id }, keys.emailSecret, {
      expiresIn: "1d"
    });
    const host = req.get("host");
    const origin = req.get("origin");
    const url = `${origin}/confirmation/${emailToken}`;
    transporter.sendMail({
      to: user.email,
      subject: "Confirm email",
      html: `Please click this link to confirm your email: <a href=${url}>${url}</a>`
    });
    res
      .status(201)
      .json({ message: `A verfication token has been sent ${user.email}` });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/resetpassword/
// @desc    Change password of a user
// @access  POST
router.post("/resetpassword", authenticate, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  let errors = {};
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      errors.message = "Internal error";
      return generateError(res, errors);
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      errors.message = "Old password did not match";
      return generateError(res, errors);
    }

    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "You password has been reset" });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/forgetpassword/
// @desc    Forget password
// @access  POST
router.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  let errors = {};

  if (!email) {
    errors.email = "Email field is required";
    return generateError(res, errors);
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      errors.message = "Email does not exist";
      return generateError(res, errors);
    }

    const emailToken = await jwt.sign({ _id: user._id }, keys.emailSecret, {
      expiresIn: "1d"
    });
    const host = req.get("host");
    const url = `http://${host}/reset/${emailToken}`;
    transporter.sendMail({
      to: user.email,
      subject: "Confirm email",
      html: `Please click this link to get redirected to password reset: <a href=${url}>${url}</a>`
    });
    res
      .status(201)
      .json({ message: `A password reset token has been sent ${user.email}` });
  } catch (e) {
    return generateError(res, e.message);
  }
});

// @route   POST api/user/reset/:token
// @desc    Reset user password
// @access  POST
router.post("/reset/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    let errors = {};

    if (!newPassword) {
      errors.password = "Password field is required";
      return generateError(res, errors);
    }

    if (!token) {
      errors.message = "Verification token error";
      return generateError(res, errors);
    }

    const decodedToken = jwt.verify(token, keys.emailSecret);
    if (!decodedToken) {
      errors.message = "Email not verified";
      return generateError(res, errors);
    }

    if (decodedToken.exp < Date.now() / 1000) {
      errors.message = "Email not verified";
      return generateError(res, errors);
    }

    const user = await User.findById(decodedToken._id);
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      message:
        "Password Reset Successful You can now login with your new password"
    });
  } catch (e) {
    return generateError(res, e.message);
  }
});

module.exports = router;
