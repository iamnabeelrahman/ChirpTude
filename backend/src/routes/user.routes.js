const { Router } = require("express");
const {
  registerUser,
  loginUser,
} = require("../controllers/user.controller.js");
const { upload } = require("../middlewares/multer.middleware.js");

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

module.exports = router;
