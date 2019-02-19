const router = require("express").Router();

const Poem = require("../../models/Poem");

const genError = require("../../utils/generateError");
const validateComment = require("../../validation/poem");
const authenticate = require("../../middleware/authenticate");

// @route   POST api/comment/:poemId
// @desc    Comment on a poem
// @access  POST
router.post("/:poemId", authenticate, async (req, res) => {
  const { isValid, errors } = validateComment(req.body);

  if (!isValid) {
    return genError(res, errors);
  }

  try {
    const { description } = req.body;
    const { poemId } = req.params;

    const poem = await Poem.findByIdAndUpdate(
      poemId,
      {
        $push: {
          comments: {
            description,
            writtenBy: req.user._id
          }
        }
      },
      { new: true }
    );

    if (!poem) {
      errors.message = "Poem doesnot exist";
      return genError(res, errors, 404);
    }

    return res.status(201).json(poem);
  } catch (e) {
    return genError(res, e.message);
  }
});

// @route   POST api/comment/:poemId/:commentId
// @desc    Delete a comment
// @access  Delete
router.delete("/:poemId/:commentId", authenticate, async (req, res) => {
  const { poemId, commentId } = req.params;
  const errors = {};

  try {
    const poem = await Poem.findById(poemId);

    if (!poem) {
      errors.message = "Poem doesnot exist";
      return genError(res, errors, 404);
    }
    const matchComment = poem.comments.filter(comment => {
      return comment._id.toString() === commentId.toString();
    })[0];

    if (!matchComment) {
      errors.message = "Comment doesnot exist";
      return genError(res, errors, 404);
    }

    await Poem.findByIdAndUpdate(poem._id, {
      $pull: {
        comments: {
          _id: matchComment._id
        }
      }
    });

    return res.status(200).json({
      message: "Comment deleted"
    });
  } catch (e) {
    return genError(res, e.message);
  }
});

module.exports = router;
