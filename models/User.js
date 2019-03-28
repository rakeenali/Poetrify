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

  notifications: [notificationSchema]
});

// userSchema.pre("save", async function(next) {
//   try {
//     console.log(this.password);
//     if (!this.password) {
//       console.log(1);
//       const salt = await bcrypt.genSalt(10);
//       if (!salt) {
//         throw new Error("User creation error");
//       }
//       const hashedPassword = await bcrypt.hash(this.password, salt);

//       if (!hashedPassword) {
//         throw new Error("User creation error");
//       }

//       this.password = hashedPassword;
//     }
//     console.log(2);
//     next();
//   } catch (e) {
//     throw e;
//   }
// });

module.exports = mongoose.model("User", userSchema, "User");
