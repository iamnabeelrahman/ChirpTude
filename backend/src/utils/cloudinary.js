const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Function to upload a local file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
  });

  try {
    if (!localFilePath) {
      console.error("No file path provided."); // Log an error if no file path is given
      return null;
    }

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("File is uploaded", uploadResult.url);
    return uploadResult;
    
  } catch (error) {

    console.log("Upload failed ", error);
    
    //removing the locally saved file as the upload operation has beed failed
    fs.unlinkSync(localFilePath);
    return null
  }

};
