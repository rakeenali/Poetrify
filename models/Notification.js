const mongoose = require("mongoose");

const { Schema } = mongoose;

const notificationSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  seen: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = notificationSchema;
