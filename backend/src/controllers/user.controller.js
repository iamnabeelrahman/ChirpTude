const { registerSchema } = require("../models/zod.models");
const { User } = require("../models/user.model");

//register api
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
    const userByEmail = await User.findOne({ username: body.username });

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

  const avatarLocalFile = req.files?.avatar[0]?.path;
  const coverImageLocalFile = req.files?.coverImage[0]?.path;

  // creating new User
  const newUser = await User.create(body);

  //sending response if user created successfully
  res.status(201).json({
    message: "user created successfully",
    user: newUser,
  });
};

//login api
const loginUser = async (req, res) => {
  const body = req.body;

  const checkUserExistence = await User.findOne({ username: body.username });
  if (!checkUserExistence) {
    return res.status(400).json({
      message: "User doesn't exist",
    });
  }

  if (checkUserExistence.password !== body.password) {
    return res.status(400).json({
      message: "incorrect password",
    });
  }

  return res.status(200).json({
    message: "Sign-in successfully",
  });
};

module.exports = { registerUser, loginUser };
