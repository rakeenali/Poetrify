const router = require("express").Router();

const Poem = require("../../models/Poem");

const genError = require("../../utils/generateError");
const authenticate = require("../../middleware/authenticate");

// @route   POST api/like/:poemId
// @desc    Like a poem
// @access  POST
router.post("/:poemId", authenticate, async (req, res) => {
  const { poemId } = req.params;
  const errors = {};
  try {
    const poem = await Poem.findById(poemId);

    if (!poem) {
      errors.message = "Poem doesnot exist";
      return genError(res, errors, 404);
    }

    const alreadyLike = poem.likes.map(like => {
      return like.likedBy.toString() === req.user._id.toString();
    })[0];

    if (alreadyLike) {
      errors.message = "Poem already liked";
      return genError(res, errors, 401);
    }

    poem.likes.unshift({
      likedBy: req.user._id
    });

    await poem.save();

    return res.status(201).json(poem);
  } catch (e) {
    return genError(res, e.message);
  }
});

// @route   DELETE api/like/:poemId
// @desc    Unlike a poem
// @access  DELETE
router.delete("/:poemId", authenticate, async (req, res) => {
  try {
    const { poemId } = req.params;
    const errors = {};

    const poem = await Poem.findByIdAndUpdate(
      poemId,
      {
        $pull: {
          likes: {
            likedBy: req.user._id
          }
        }
      },
      { new: true }
    );

    if (!poem) {
      errors.message = "Poem doesnot exist";
      return genError(res, errors, 404);
    }
    return res.status(200).json(poem);
  } catch (e) {
    return genError(res, e.message);
  }
});

module.exports = router;
