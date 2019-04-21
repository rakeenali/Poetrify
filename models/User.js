const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const notificationSchema = require("./Notification");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile"
  },

  poems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Poem"
    }
  ],

  isVerifed: {
    type: Boolean,
    required: true,
    default: false
  },

  followedBy: [
    // who is following me
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    // who am i following
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  recomendationRecordIds: [Schema.Types.ObjectId],

  notifications: [notificationSchema],

  conversation: {
    type: Schema.Types.ObjectId
  }
});
module.exports = mongoose.model("User", userSchema, "User");
