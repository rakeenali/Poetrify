const mongoose = require("mongoose");

const { Schema } = mongoose;

const profileSchama = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  dateOfBirth: {
    type: Date,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  handle: {
    type: String,
    required: true
  },
  city: {
    type: String
  }
});

module.exports = mongoose.model("Profile", profileSchama, "Profile");
