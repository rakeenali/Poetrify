const mongoose = require("mongoose");

const { Schema } = mongoose;

const conversationSchema = new Schema({
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  conversations: [
    {
      with: {
        type: Schema.Types.ObjectId,
        ref: "User"
      },

      messages: [
        {
          message: {
            type: String,
            required: true
          },
          from: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
          },
          messagedAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
    }
  ]
});

module.exports = mongoose.model(
  "Conversation",
  conversationSchema,
  "Conversation"
);
