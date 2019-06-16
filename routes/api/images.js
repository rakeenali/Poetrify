const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const uuid = require("uuid");

const Profile = require("../../models/Profile");
const Group = require("../../models/Group");

const authenticate = require("../../middleware/authenticate");
const genError = require("../../utils/generateError");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function(req, file, cb) {
    cb(null, uuid.v1().replace(/ /g, "") + file.originalname.replace(/ /g, ""));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only accept files of type jpeg and png"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

// @route   GET api/image/profile
// @desc    CURRENT PROFILE IMAGE OF A USER
// @access  GET
router.get("/profile", authenticate, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user._id
    });

    if (!profile) {
      return genError(res, { image: "NO Image" });
    }

    const host = req.get("host");

    return res.json({
      image: `${host}/${profile.profileImage}`
    });
  } catch (err) {
    return genError(res, err.message);
  }
});

// @route   POST api/image/profile
// @desc    Add profile image
// @access  POST
router.post(
  "/profile",
  authenticate,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const errors = {};
      if (req.file) {
        const profile = await Profile.findOneAndUpdate(
          { user: req.user._id },
          {
            profileImage: req.file.path
          },
          { new: true }
        );

        return res.status(201).json({
          ...profile._doc
        });
      } else {
        errors.message = "Image cannot be stored";
        return genError(res, errors);
      }
    } catch (err) {
      return genError(res, err.message);
    }
  }
);

// @route   POST api/image/group/:groupId
// @desc    Add image for the group
// @access  POST
router.post(
  "/group/:groupId",
  authenticate,
  upload.single("groupImage"),
  async (req, res) => {
    try {
      let errors = {};
      const { groupId } = req.params;
      let canAdd = false;

      const group = await Group.findById(groupId)
        .select("admins")
        .lean()
        .exec();

      if (!group) {
        errors.message = "Image cannot be stored";
        return genError(res, errors);
      }

      group.admins.map(adminId => {
        if (adminId.toString() === req.user._id.toString()) {
          canAdd = true;
          return;
        }
      });

      if (!canAdd) {
        errors.message = "Image cannot be stored unauthorized operation";
        return genError(res, errors);
      }

      const newGroup = await Group.findByIdAndUpdate(
        groupId,
        {
          groupImage: req.file.path
        },
        { new: true }
      )
        .lean()
        .exec();

      return res.status(200).json(newGroup);
    } catch (err) {
      return genError(res, err.message);
    }
  }
);

module.exports = router;
