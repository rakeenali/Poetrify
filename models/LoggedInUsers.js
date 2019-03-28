const mongoose = require("mongoose");

const { Schema } = mongoose;

const loggedInUsers = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  socketId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model(
  "LoggedInUsers",
  loggedInUsers,
  "LoggedInUsers"
);
