const router = require("express").Router();
const _ = require("lodash");

const genError = require("../../utils/generateError");
const authenticate = require("../../middleware/authenticate");

const User = require("../../models/User");
const Group = require("../../models/Group");

// @route   GET api/search
// @desc    Show search result
// @access  GET
router.get("/", authenticate, async (req, res) => {
  try {
    const users = await User.find()
      .select("name email profile")
      .populate("profile", "handle profileImage")
      .lean()
      .exec();

    const groups = await Group.find()
      .select("title groupImage")
      .lean()
      .exec();

    // const userSearch = users.reduce(user => {
    //   if (user._id.toString() === req.user._id.toString()) {
    //     return false;
    //   }

    //   return {
    //     name: user.name,
    //     link: `/profile/${user.profile.handle}`,
    //     image: user.profile.profileImage,
    //     is: "User"
    //   };
    // });

    const userSearch = users.reduce((acc, user) => {
      if (user._id.toString() !== req.user._id.toString()) {
        acc.push({
          name: user.name,
          link: `/profile/${user.profile.handle}`,
          image: user.profile.profileImage,
          is: "User"
        });
      }
      return acc;
    }, []);

    const groupSearch = groups.map(group => {
      return {
        name: group.title,
        link: `/group/${group._id}`,
        image: group.groupImage,
        is: "Group"
      };
    });

    const shuffled = _.shuffle([...userSearch, ...groupSearch]);
    res.status(200).send(shuffled);
  } catch (err) {
    return genError(res, err.message);
  }
});

module.exports = router;
