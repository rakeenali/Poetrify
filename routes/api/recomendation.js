const router = require("express").Router();
const genError = require("../../utils/generateError");
const isEmpty = require("lodash/isEmpty");

const authenticate = require("../../middleware/authenticate");

const User = require("../../models/User");
const Poem = require("../../models/Poem");

const Recomendation = require("../../recomendation/Recomendation");

// @route   GET api/recomendation
// @desc    Recomend poems to a user
// @access  GET
router.get("/", authenticate, async (req, res) => {
  try {
    const recomendation = new Recomendation();
    const user = await User.findById(req.user._id)
      .lean()
      .exec();

    let recomendationRecordIds = [];
    if (!isEmpty(user.recomendationRecordIds)) {
      recomendationRecordIds = recomendationRecordIds.concat(
        user.recomendationRecordIds.map(ids => ids.toString())
      );
    }

    let knownPeopleList = [];
    if (!isEmpty(user.followedBy)) {
      knownPeopleList = knownPeopleList.concat(
        user.followedBy.map(id => id.toString())
      );
    }

    if (!isEmpty(user.following)) {
      knownPeopleList = knownPeopleList.concat(
        user.following.map(id => id.toString())
      );
    }

    recomendation.getMetaPoem(recomendationRecordIds);
    recomendation.getKnownUser(knownPeopleList);
    recomendation.getRecomendationData();

    const recomendedPoems = await recomendation.getPoems();

    if (!recomendedPoems.canRecomend) {
      let poems = await Poem.find()
        .select("_id")
        .sort({ createdAt: "-1" })
        .limit(100)
        .lean()
        .exec();

      poems = poems.map(({ _id }) => _id.toString());
      return res.status(200).json({ ids: poems });
    } else {
      return res.status(200).json({ ids: recomendedPoems.ids });
    }
  } catch (err) {
    return genError(res, err.message);
  }
});

module.exports = router;
