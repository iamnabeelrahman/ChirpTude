const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} = require("../controllers/user.controller.js");
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJwt } = require("../controllers/auth.middleware.js");

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
module.exports = router; // exporting router
