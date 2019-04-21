const router = require("express").Router();

const User = require("../../models/User");
const Conversation = require("../../models/Conversation");

const genError = require("../../utils/generateError");
const authenticate = require("../../middleware/authenticate");

// @route   POST api/conversation/send-message
// @desc    send message
// @access  POST
router.post("/send-message", authenticate, async (req, res) => {
  try {
    const userA = await User.findById(req.user._id);
    const userB = await User.findById(req.body._id);

    if (!userA || !userB) {
      return genError(res, "User does not exist", 400);
    }

    let exist = false;

    userA.followedBy.map(({ _id }) => {
      if (_id.toString() === userB._id.toString()) {
        exist = true;
        return;
      }
    });
    if (!exist) {
      userA.following.map(({ _id }) => {
        if (_id.toString() === userB._id.toString()) {
          exist = true;
          return;
        }
      });
    }

    if (!exist) {
      return genError(res, "You cannot message to that user", 400);
    }

    const conversationA = await Conversation.findOne({
      belongsTo: userA._id
    });
    const conversationB = await Conversation.findOne({
      belongsTo: userB._id
    });

    exist = false;

    conversationA.conversations.map(conv => {
      if (conv.with.toString() === userB._id.toString()) {
        exist = true;
      }
    });

    if (!exist) {
      conversationA.conversations.push({
        with: userB._id
      });
      conversationB.conversations.push({
        with: userA._id
      });
    }

    for (let conversation of conversationA.conversations) {
      if (conversation.with.toString() === userB._id.toString()) {
        conversation.messages.push({
          message: req.body.message,
          from: userA._id
        });
      }
    }

    for (let conversation of conversationB.conversations) {
      if (conversation.with.toString() === userA._id.toString()) {
        conversation.messages.push({
          message: req.body.message,
          from: userA._id
        });
      }
    }

    await conversationA.save();
    await conversationB.save();

    req.notification.messageNotification(userB._id);

    res.send({});
  } catch (err) {
    return genError(res, err.message, 400);
  }
});

// @route   GET api/conversation/conversations
// @desc    get conversation record of a current user
// @access  GET
router.get("/conversations", authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      belongsTo: req.user._id
    })
      .populate("conversations.with", "email name")
      .lean()
      .exec();

    if (!conversation) {
      return genError(res, "User does not exist", 404);
    }

    const records = conversation.conversations.map(record => {
      return record;
    });

    return res.status(200).json({ records });
  } catch (err) {
    return genError(res, err.message, 400);
  }
});

module.exports = router;
