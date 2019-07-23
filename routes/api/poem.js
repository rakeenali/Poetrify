const router = require("express").Router();

const Poem = require("../../models/Poem");
const User = require("../../models/User");
const authenticate = require("../../middleware/authenticate");

const validatePoem = require("../../validation/poem");
const genError = require("../../utils/generateError");

// @route   POST api/poem/many
// @desc    Get many poems by id
// @access  GET
router.post("/many", async (req, res) => {
  try {
    const { poemIds, sort } = req.body;
    if (!sort) {
      const poems = await Poem.find({
        _id: { $in: poemIds }
      })
        .sort({ createdAt: -1 })
        .populate("createdBy", "name _id")
        .populate("comments.writtenBy", "name _id")
        .populate("likes.likedBy", "name _id");
      return res.status(200).json(poems);
    }
    const poems = await Poem.find({
      _id: { $in: poemIds }
    })
      .populate("createdBy", "name _id")
      .populate("comments.writtenBy", "name _id")
      .populate("likes.likedBy", "name _id");
    return res.status(200).json(poems);
  } catch (e) {
    return genError(res, e.message);
  }
});

// @route   GET api/poem/ids/queries
// @desc    Get ids of poems
// @access  GET
router.get("/ids", async (req, res) => {
  try {
    const poems = await Poem.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit))
      .lean()
      .exec();

    const ids = poems.map(({ _id }) => _id);
    res.status(200).json({
      poemIds: ids
    });
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   POST api/poem/:id
// @desc    Get poem by id
// @access  GET
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let errors = {};

  try {
    const poem = await Poem.findById(id)
      .populate("createdBy", "name _id")
      .populate("comments.writtenBy", "name _id")
      .populate("likes.likedBy", "name _id");

    if (!poem) {
      errors.message = "Poem by this id does not exist";
      return genError(res, errors, 404);
    }

    return res.status(200).json({
      ...poem._doc,
      _id: poem.id
    });
  } catch (e) {
    return genError(res, e.message);
  }
});

// @route   POST api/poem
// @desc    Write a poem
// @access  POST
router.post("", authenticate, async (req, res) => {
  const { isValid, errors } = validatePoem(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const { description } = req.body;
    const poem = new Poem({
      description,
      createdBy: req.user._id
    });

    await poem.save();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: {
          poems: poem._id
        }
      },
      {
        new: true
      }
    );

    req.notification.poemNotification(user.followedBy, user.name, poem._id);

    return res.status(201).json({
      ...poem._doc,
      _id: poem._id
    });
  } catch (e) {
    throw e;
  }
});

// @route   POST api/poem/:id
// @desc    Update a poem
// @access  POST
router.post("/:id", authenticate, async (req, res) => {
  const { isValid, errors } = validatePoem(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const { description } = req.body;

    const idMatch = await Poem.findById(req.params.id);

    if (!idMatch) {
      errors.message = "Poem by this id does not exist";
      return genError(res, errors, 404);
    }

    if (idMatch.createdBy.toString() !== req.user._id.toString()) {
      errors.message = "Auth failed";
      return genError(res, errors, 401);
    }

    const poem = await Poem.findByIdAndUpdate(
      req.params.id,
      {
        description,
        updatedAt: Date.now()
      },
      { new: true }
    );

    return res.status(201).json({
      ...poem._doc,
      _id: poem._id
    });
  } catch (e) {
    throw e;
  }
});

// @route   DELETE api/poem/:id
// @desc    Delete a poem
// @access  DELETE
router.delete("/:id", authenticate, async (req, res) => {
  const errors = {};
  try {
    const { id } = req.params;

    const poem = await Poem.findById(id);
    if (!poem) {
      errors.message = "Poem doesnot exist";
      return genError(res, errors);
    }

    if (poem.createdBy.toString() !== req.user._id.toString()) {
      errors.message = "Auth failed";
      return genError(res, errors, 401);
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        poems: poem._id
      }
    });

    await poem.delete();

    return res.status(200).json({ message: "Poem deleted" });
  } catch (e) {
    return genError(res, e.message);
  }
});

module.exports = router;
