const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user.controller.js");
const { upload } = require("../middlewares/multer.middleware.js");
const { verifyJwt } = require("../controllers/auth.middleware.js");

const router = Router();

// register route
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

// login route
router.route("/login").post(loginUser);

//logout route
router.route("/logout").delete(verifyJwt, logoutUser) 


// exporting router
module.exports = router;
