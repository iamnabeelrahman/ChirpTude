const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model.js");

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(400).json({
        message: "unauthorized request",
      });
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const userDetails = await User.findByID(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!userDetails) {
      res.status(401).json({
        message: "Invalid access token",
      });
    }

    req.user = userDetails;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid access token",
    });
  }
};

module.exports = { verifyJwt };
