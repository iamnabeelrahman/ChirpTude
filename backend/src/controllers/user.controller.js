const { registerSchema } = require("../models/zod.models.js");
const { User } = require("../models/user.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const jwt = require("jsonwebtoken");

//register controller
const registerUser = async (req, res) => {
  // getting details from frontend
  const body = req.body;

  // details should be as per Zod schema
  const parsedBody = registerSchema.safeParse(body);

  if (!parsedBody.success) {
    return res.status(403).json({
      message: "invalid input",
    });
  }

  // checking if user exist
  try {
    // Check if same username exists
    const userByUsername = await User.findOne({ username: body.username });

    // Check if same email exists
    const userByEmail = await User.findOne({ email: body.email });

    const messages = [];

    if (userByUsername) {
      messages.push("Username already exists");
    }

    if (userByEmail) {
      messages.push("Email already exists");
    }

    if (messages.length > 0) {
      console.log(messages.join(", "));
      return res.status(409).json({
        messages: messages.join(", "), // Combined messages for user existance
      });
    }
  } catch (error) {
    console.log("error checking user existence: ", error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }

  const avatarLocalFile = req.files?.avatar?.[0]?.path;
  const coverImageLocalFile = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalFile) {
    return res.status(400).json({
      message: "avatar is required",
    });
  }

  const uploadedAvatar = await uploadOnCloudinary(avatarLocalFile);
  let uploadedCoverImage = null; // Declare this variable

  if (coverImageLocalFile) {
    uploadedCoverImage = await uploadOnCloudinary(coverImageLocalFile);
  }

  if (!uploadedAvatar) {
    console.log("Avatar upload failed");
    return res.json({
      message: "Avatar upload failed",
    });
  }

  const { email, username, ...otherDetails } = body;

  // creating new User
  const newUser = await User.create({
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    avatar: uploadedAvatar.url,
    coverImage: uploadedCoverImage ? uploadedCoverImage.url : null,
    ...otherDetails, // Added the rest of the body properties here
  });

  const checkCreatedUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );

  if (!checkCreatedUser) {
    return res.status(500).json({
      message: "Something went wrong while registering user",
    });
  }

  //sending response if user created successfully
  res.status(201).json({
    success: true,
    message: "user registered successfully",
    data: checkCreatedUser,
  });
};

//login controller
const loginUser = async (req, res) => {
  const body = req.body;

  if (!(body.username || body.email)) {
    return res.status(422).json({
      message: "username or email is required",
    });
  }

  const checkUserExistence = await User.findOne({
    $or: [{ username: body.username }, { email: body.email }],
  });

  if (!checkUserExistence) {
    return res.status(400).json({
      message: "User doesn't exist",
    });
  }

  const validPassword = await checkUserExistence.isPasswordCorrect(
    body.password
  );

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid user credentials",
    });
  }

  const accessToken = await checkUserExistence.generateAccessToken();
  const refreshToken = await checkUserExistence.generateRefreshToken();

  checkUserExistence.refreshToken = refreshToken;
  await checkUserExistence.save({ validateBeforeSave: false });

  const returnUserDetails = await User.findById(checkUserExistence._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      message: "sign-in successfully",
      user: returnUserDetails,
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
}; 
// log out controller
const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: true,
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Logged out errro: ", error);
    res.status(500).json({
      message: "An arror occurred while logging out",
    });
  }
};


// new access token controller
const refreshAccessToken = async (req, res) => {
  const incomingUserToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingUserToken) {
    return res.status(401).json({
      message: "Unauthorized request. Refresh token is missing.",
    });
  }

  try {
    // Verify the refresh token
    const decodedToken = await jwt.verify(
      incomingUserToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Find the user associated with the token
    const userDetails = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!userDetails) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    // Generate a new access token
    const accessToken = await userDetails.generateAccessToken();
    const newRefreshToken = await userDetails.generateRefreshToken();

    userDetails.refreshToken = newRefreshToken
    await userDetails.save({ validateBeforeSave: false });

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options).json({
      message: "new access token set sucessfully",
      success: true,
      accessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid or expired refresh token.",
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
};
