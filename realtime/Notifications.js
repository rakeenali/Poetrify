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
      this.notifcation.to(user.socketId).emit("newFollower");
    } catch (err) {
      throw err;
    }
  }

  async messageNotification(userId) {
    const user = await LoggedInUsers.findOne({ userId })
      .lean()
      .exec();

    if (!user) {
      const obj = {
        message: `You recieved a new message`,
        link: `/messages`
      };

      await User.findByIdAndUpdate(userId, {
        $push: {
          notifications: obj
        }
      });
      return;
    }

    this.notifcation.to(user.socketId).emit("newMessage");
  }

  async groupNotification(group) {
    const obj = {
      message: `A new request from a user to join group ${group.title}`,
      link: `/group/${group._id}`
    };

    const user = await User.findByIdAndUpdate(
      group.admins[0],
      {
        $push: {
          notifications: obj
        }
      },
      { new: true }
    );
    console.log(user);
    console.log("new gropup request");
    this.notifcation.to(group.admins[0]).emit("newGroupRequest");
  }
};
