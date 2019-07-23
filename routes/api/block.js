const router = require("express").Router();
const authenticate = require("../../middleware/authenticate");
const genError = require("../../utils/generateError");

const User = require("../../models/User");

// @route   POST api/block/:userId
// @desc    Block a user
router.post("/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          followedBy: userId,
          following: userId
        },
        $push: {
          blockedUsers: userId
        }
      },
      { new: true }
    );

    console.log(currentUser);

    res.status(200).json({ message: "User blocked" });
  } catch (err) {
    return genError(res, e.message);
  }
});

module.exports = router;
