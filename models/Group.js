const mongoose = require("mongoose");

const { Schema } = mongoose;

const groupSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  groupImage: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },

  poems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Poem"
    }
  ],

  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  requests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

module.exports = mongoose.model("Group", groupSchema, "Group");
