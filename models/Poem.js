const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = require("./Comment");
const likeSchema = require("./Like");

const poemSchema = new Schema({
  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  updatedAt: {
    type: Date
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  comments: [commentSchema],

  likes: [likeSchema]
});

module.exports = mongoose.model("Poem", poemSchema, "Poem");
