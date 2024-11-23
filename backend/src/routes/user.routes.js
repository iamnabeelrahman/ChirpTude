const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user.controller.js");
const { updatePassword } = require("../controllers/user.update.controller.js");
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJwt } = require("../middlewares/auth.middleware.js");

const router = Router();

// register API
router.route("/register").post(
  upload,
  registerUser
);

router.route("/login").post(loginUser); // login API

router.route("/logout").delete(verifyJwt, logoutUser);// logout API


// secured routes
router.route('/new-token').post(refreshAccessToken)  //new token api
router.route('/new-password').post(verifyJwt, updatePassword)

module.exports = router; // exporting router
