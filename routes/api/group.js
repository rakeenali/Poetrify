const router = require("express").Router();
const _ = require("lodash");

const User = require("../../models/User");
const Group = require("../../models/Group");
const Poem = require("../../models/Poem");

const validateGroup = require("../../validation/group");
const genError = require("../../utils/generateError");
const authenticate = require("../../middleware/authenticate");

// @route   GET api/group/single/:groupId
// @desc    GEt a single group
// @access  GET
router.get("/single/:groupId", authenticate, async (req, res) => {
  try {
    let errors = {};

    const group = await Group.findById(req.params.groupId)
      .populate({
        path: "members",
        select: "_id name profile",
        populate: {
          path: "profile",
          select: "profileImage handle"
        }
      })
      .populate({
        path: "admins",
        select: "_id name profile",
        populate: {
          path: "profile",
          select: "profileImage handle"
        }
      })
      .populate({
        path: "requests",
        select: "_id name profile",
        populate: {
          path: "profile",
          select: "profileImage handle"
        }
      })
      .populate({
        path: "poems",
        select: "_id"
      })
      .lean()
      .exec();

    if (!group) {
      errors.message = "Group does not exist";
      return genError(res, errors, 404);
    }

    return res.status(200).json(group);
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   POST api/group/create
// @desc    Create a group
// @access  POST
router.post("/create", authenticate, async (req, res) => {
  const { isValid, errors } = validateGroup(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const { title, description } = req.body;

    const group = await new Group({
      title,
      description
    });
    group.admins.push(req.user._id);
    await group.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        groupsCreated: group._id
      }
    });

    res.status(200).json(group);
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   DELETE api/group/delete/:groupId
// @desc    Delete a group
// @access  DELETE
router.delete("/delete/:groupId", authenticate, async (req, res) => {
  try {
    let canDelete = false;
    let errors = {};

    const { groupId } = req.params;

    const group = await Group.findById(groupId).exec();

    if (!group) {
      errors.message = "Group does not exist";
      return genError(res, errors, 404);
    }

    group.admins.forEach(id => {
      if (id.toString() === req.user._id.toString()) {
        canDelete = true;
      }
    });

    if (!canDelete) {
      errors.message = "You cannot delete this group";
      return genError(res, errors, 401);
    }

    await group.delete();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        groupsCreated: group._id
      }
    })
      .lean()
      .exec();

    return res.status(200).json({ message: "Group deleted" });
  } catch (err) {
    return genError(res, err.message);
  }
});

// @route   GET api/group/all
// @desc    Get all the groups
// @access  GET
router.get("/all", authenticate, async (req, res) => {
  try {
    const groups = await Group.find({})
      .populate("admins", "name email")
      .lean()
      .exec();

    return res.status(200).json(groups);
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   GET api/group/request/:groupId
// @desc    Request to a group for join
// @access  GET
router.get("/request/:groupId", authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findByIdAndUpdate(
      groupId,
      {
        $push: {
          requests: req.user._id
        }
      },
      { new: true }
    );

    req.notification.groupNotification(group);

    res.status(200).json(group);
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   GET api/group/request/:groupId/:userId
// @desc    Add other user to a group for request
// @access  GET
router.get("/request/:groupId/:userId", authenticate, async (req, res) => {
  try {
    let errors = {};
    const { groupId, userId } = req.params;

    const group = await Group.findById(groupId)
      .lean()
      .exec();

    if (!group) {
      errors.message = "Group does not exist";
      return genError(res, errors, 404);
    }

    const user = await User.findById(userId)
      .select("_id")
      .lean()
      .exec();

    if (!user) {
      errors.message = "User does not exist";
      return genError(res, errors, 404);
    }

    await Group.findByIdAndUpdate(groupId, {
      $push: {
        requests: userId
      }
    }).exec();

    return res.status(201).json({ message: "Request sent" });
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   GET api/group/add-member/:groupId/:requestId
// @desc    Add members to the group
// @access  GET
router.get(
  "/add-member/:groupId/:requestId",
  authenticate,
  async (req, res) => {
    try {
      let errors = {};
      let canAdd = false;
      const { groupId, requestId } = req.params;

      const user = await User.findById(requestId)
        .select("_id")
        .lean()
        .exec();

      if (!user) {
        errors.message = "User does not exist";
        return genError(res, errors, 404);
      }

      const adminUser = await User.findById(req.user._id)
        .select("_id")
        .lean()
        .exec();

      const group = await Group.findById(groupId).exec();

      if (!group) {
        errors.message = "Group does not exist";
        return genError(res, errors, 404);
      }

      group.admins.map(adminId => {
        if (adminId.toString() === adminUser._id.toString()) {
          canAdd = true;
        }
      });

      group.members.map(memberId => {
        if (memberId.toString() === user._id.toString()) {
          canAdd = false;
        }
      });

      if (!canAdd) {
        errors.message = "You are not authorized to make changes to this group";
        return genError(res, errors, 400);
      }

      group.members.push(user._id);
      group.requests = [
        ...group.requests.filter(_id => {
          return _id.toString() !== user._id.toString();
        })
      ];
      await group.save();

      await User.findByIdAndUpdate(requestId, {
        $push: {
          groupsPartOff: group._id
        }
      });

      return res.status(200).json(group);
    } catch (err) {
      return genError(res, e.message);
    }
  }
);

// @route   DELETE api/group/delete-member/:groupId/:requestId
// @desc    Remove members from the group
// @access  DELETE
router.delete(
  "/delete-member/:groupId/:userDeleteId",
  authenticate,
  async (req, res) => {
    try {
      let add = false;
      let errors = {};

      const { groupId, userDeleteId } = req.params;

      const group = await Group.findById(groupId).exec();

      group.admins.forEach(id => {
        if (id.toString() === req.user._id.toString()) {
          add = true;
        }
      });

      if (!add) {
        errors.message = "Unauthroized acces";
        return genError(res, errors, 401);
      }

      group.members = [
        ...group.members.filter(id => {
          return id.toString() !== userDeleteId.toString();
        })
      ];

      await User.findByIdAndUpdate(userDeleteId, {
        $pull: {
          groupsPartOff: group._id
        }
      })
        .lean()
        .exec();

      await group.save();
      return res.status(200).json({ message: "User Removed" });
    } catch (err) {
      return genError(res, e.message);
    }
  }
);

// @route   DELETE api/group/delete-current/:groupId
// @desc    Remove yourself from the group
// @access  DELETE
router.delete("/delete-current/:groupId", authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).exec();

    group.members = [
      ...group.members.filter(id => {
        return id.toString() !== req.user._id.toString();
      })
    ];

    await User.findByIdAndUpdate(req.user._id, {
      $pull: {
        groupsPartOff: group._id
      }
    })
      .lean()
      .exec();

    await group.save();

    return res.status(200).json({ message: "You are removed from this group" });
  } catch (err) {
    return genError(res, e.message);
  }
});

// Add image from the images folder

// @route   GET api/group/current
// @desc    Logged in user all the groups that he exist in
// @access  GET
router.get("/current", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("groupsCreated groupsPartOff")
      .lean()
      .exec();

    const groupsCreated = await Group.find({
      _id: { $in: user.groupsCreated }
    })
      .lean()
      .exec();

    const groupsPartOff = await Group.find({
      _id: { $in: user.groupsPartOff }
    })
      .lean()
      .exec();

    return res.status(200).json({
      groupsCreated,
      groupsPartOff
    });
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   GET api/group/user/:userId
// @desc    The groups that user exist in
// @access  GET
router.get("/user/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("groupsCreated groupsPartOff")
      .lean()
      .exec();

    const groupsCreated = await Group.find({
      _id: { $in: user.groupsCreated }
    })
      .lean()
      .exec();

    const groupsPartOff = await Group.find({
      _id: { $in: user.groupsPartOff }
    })
      .lean()
      .exec();

    return res.status(200).json({
      groupsCreated,
      groupsPartOff
    });
  } catch (err) {
    return genError(res, e.message);
  }
});

// @route   POST api/group/write-poem/:groupId
// @desc    Write a poem to the group
// @access  POST
router.post("/write-poem/:groupId", authenticate, async (req, res) => {
  try {
    let errors = {},
      canAdd = false;
    const { groupId } = req.params;
    const { description } = req.body;

    const group = await Group.findById(groupId).exec();

    group.members.forEach(id => {
      if (id.toString() === req.user._id.toString()) {
        canAdd = true;
      }
    });

    if (!canAdd) {
      group.admins.forEach(id => {
        if (id.toString() === req.user._id.toString()) {
          canAdd = true;
        }
      });
    }

    if (!canAdd) {
      errors.message = "Cannot add poem";
      return genError(res, errors, 401);
    }

    const poem = await new Poem({
      description,
      createdBy: req.user._id,
      fromGroup: true
    }).save();

    group.poems.unshift(poem._id);
    await group.save();

    return res.status(201).json({
      message: "Poem created"
    });
  } catch (err) {
    return genError(res, e.message);
  }
});

// Delete and update poem is done in poem

// Add comments

module.exports = router;
