const router = require("express").Router();

const User = require("../../models/User");

const authenticate = require("../../middleware/authenticate");
const genError = require("../../utils/generateError");

// @route   POST api/follow/:userId
// @desc    Follow a user
// @access  POST
router.post("/:userId", authenticate, async (req, res) => {
  try {
    const errors = {};
    const add = true;
    const { userId } = req.params;

    const followingUser = await User.findById(req.user._id);
    const followedByUser = await User.findById(userId);

    if (!followedByUser || !followingUser) {
      errors.message = "User does not exist";
      return genError(res, errors);
    }

    followingUser.following.map(user => {
      if (user._id.toString() === userId.toString()) {
        errors.message = "User already followed";
        add = false;
        return genError(res, errors);
        throw errors;
      }
    });

    if (add) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          following: userId
        }
      });

      await User.findByIdAndUpdate(userId, {
        $push: {
          followedBy: req.user._id
        }
      });

      return res.status(200).json({ message: "User followed" });
    } else {
      throw errors;
    }
  } catch (e) {
    return genError(res, e.message);
  }
});

// @route   DELETE api/follow/:userId
// @desc    Unfollow a user
// @access  DELETE
router.delete("/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const followingUser = await User.findById(req.user._id);
    const followedByUser = await User.findById(userId);

    if (!followedByUser || !followingUser) {
      errors.message = "User does not exist";
      return genError(res, errors);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        following: userId
      }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: {
        followedBy: req.user._id
      }
    });

    return res.status(200).json({ message: "User unfollowed" });
  } catch (e) {
    return genError(res, e.message);
  }
});

module.exports = router;
