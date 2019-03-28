const LoggedInUsers = require("../models/LoggedInUsers");
const User = require("../models/User");
const Profile = require("../models/Profile");

module.exports = class Notification {
  constructor(io) {
    this.io = io;

    this.notifcation = this.io.of("notification");

    this.notifcation.on("connection", socket => {
      this.socket = socket;
      console.log("User Connected");

      this.socket.on("disconnect", async () => {
        console.log("disconnect");
        LoggedInUsers.findOneAndDelete({
          socketId: socket.id
        }).catch(err => {
          throw err;
        });
      });
    });
  }

  static joinNotification(data) {
    LoggedInUsers.findOneAndUpdate(
      { userId: data.userId },
      { socketId: data.socketId },
      { upsert: true }
    )
      .then(res => {
        return;
      })
      .catch(err => {
        throw err;
      });
  }

  // sendMessage(message, options) {
  //   this.notifcation
  //     .to(options.toSocketId)
  //     .emit("message", `Message from ${options.fromName} ${message}`);
  // }

  async poemNotification(usersId, name, poemId) {
    const obj = {
      message: `${name} has created a new poem`,
      link: `/poem/${poemId}`
    };

    await User.updateMany(
      { _id: { $in: usersId } },
      {
        $push: {
          notifications: obj
        }
      }
    );
    const users = await LoggedInUsers.find({ userId: { $in: usersId } });
    users.map(({ socketId }) => {
      this.notifcation.to(socketId).emit("newPoem");
    });
  }

  async followNotification(userId, followerId) {
    try {
      const profile = await Profile.findOne({ user: followerId }).lean();
      if (!profile) {
        return;
      }
      const obj = {
        message: `${profile.firstName} ${
          profile.lastName
        } has just started to follow you`,
        link: `/profile/${profile.handle}`
      };

      await User.findByIdAndUpdate(userId, {
        $push: {
          notifications: obj
        }
      });

      const user = await LoggedInUsers.findOne({ userId });
      this.notifcation
        .to(user.socketId)
        .emit("newFollower", { msg: "new follower" });
    } catch (err) {
      throw err;
    }
  }
};
