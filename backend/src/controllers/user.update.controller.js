const { User } = require("../models/user.model");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: user,
  });
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confPassword } = req.body;
  const userId = req.user?._id;

  // Check if new password and confirm password match
  if (newPassword !== confPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match.",
      data: null,
    });
  }

  try {
    // Fetch the user's details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    // Verify if the current password is correct
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid current password.",
        data: null,
      });
    }

    // Update and save the new password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      data: null,
    });
  }
};

const updateFullName = async (req, res) => {
  const { firstName, lastName } = req.body;
  const userId = req.user?._id;

  try {
    // Fetch the user's details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    // Update and save the new fullName
    user.fullName = firstName + " " + lastName;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Full name updated successfully.",
      data: { fullName: user.fullName },
    });
  } catch (error) {
    console.error("Error updating fullName:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      data: null,
    });
  }
};

const updateEmail = async (req, res) => {
  const { email } = req.body;
  const userId = req.user?._id;

  try {
    // Fetch the user's details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
        data: null,
      });
    }

    // Update and save the new email
    user.email = email;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email updated successfully.",
      data: null,
    });
  } catch (error) {
    console.error("Error updating email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
      data: null,
    });
  }
};

const updateAvatar = async (req, res) => {
  const avatar = req.file?.path;

  if (!updateAvatar) {
    return res.status(400).json({
      success: false,
      message: "avatar image is missing",
      data: null,
    });
  }

  const uploadedAvatar = await uploadOnCloudinary(avatar);

  if (!uploadedAvatar.url) {
    return res.status(400).json({
      success: false,
      message: "error while uploading avatar",
      data: false,
    });
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: uploadedAvatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json({
    success: true,
    message: "Avatar updated successfully",
    data: uploadedAvatar.url,
  });
};

module.exports = {
  getCurrentUser,
  updatePassword,
  updateFullName,
  updateEmail,
  updateAvatar,
};
