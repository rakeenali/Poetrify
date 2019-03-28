const router = require("express").Router();

const Notification = require("../../realtime/Notifications");
const authenticate = require("../../middleware/authenticate");

const User = require("../../models/User");
const LoggedInUser = require("../../models/LoggedInUsers");

// @route   POST api/notification/join
// @desc    Add log in user to notificaiton
// @access  POST
router.post("/join", authenticate, (req, res) => {
  Notification.joinNotification({
    userId: req.user._id,
    socketId: req.body.socketId
  });
  res.status(200);
});

// @route   GET api/notification/get-notifications
// @desc    get notification of a logged in user
// @access  GET
router.get("/get-notifications", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .lean()
      .exec();

    const seenCount = user.notifications.filter(({ seen }) => seen === false)
      .length;

    res.status(200).json({
      notifications: user.notifications,
      length: user.notifications.length,
      unseen: seenCount
    });
  } catch (err) {
    throw err;
  }
});

// @route   DELETE api/notification/:id
// @desc    get notification of a logged in user
// @access  DELETE
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findOne(req.user._id);
    const notifications = user.notifications.map(notification => {
      if (notification._id.toString() === req.params.id.toString()) {
        notification.seen = true;
        return notification;
      }
      return notification;
    });

    user.notifications = notifications;
    await user.save();

    return res.status(200).send({});
  } catch (err) {
    throw err;
  }
});

// /api/testing/message/:id
router.post("/message/:id", authenticate, async (req, res) => {
  try {
    const toUser = await User.findById(req.params.id);
    const fromUser = await User.findById(req.user._id);
    const toUserId = await LoggedInUser.findOne({ userId: req.params.id });
    const fromUserId = await LoggedInUser.findOne({ userId: req.user._id });

    req.notification.sendMessage(req.body.message, {
      fromName: fromUser.email,
      toName: toUser.email,
      fromSocketId: fromUserId.socketId,
      toSocketId: toUserId.socketId
    });
    res.send({ msg: "Success" });
  } catch (err) {
    throw err;
  }
});

module.exports = router;
