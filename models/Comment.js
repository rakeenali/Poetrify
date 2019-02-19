const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },

  writtenBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = commentSchema;
