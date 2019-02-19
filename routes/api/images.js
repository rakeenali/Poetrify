const multer = require("multer");
const path = require("path");
const router = require("express").Router();
const uuid = require("uuid");

const Profile = require("../../models/Profile");

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
  limits: {
    fileSize: 1024 * 1024 + 3
  }, // images smaller than 3 mb
  fileFilter
});

router.get("", (req, res) => {
  const origin = req.get("host");

  console.log(origin);
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
        console.log(req.file);

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

module.exports = router;
