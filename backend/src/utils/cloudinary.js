const cloudinary = require("cloudinary").v2;
const fs = require("fs")

// Your Cloudinary configuration and usage here
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:  process.env.CLOUDINARY_API_KEY, 
        api_secret:  process.env.CLOUDINARY_CLOUD_SECRET 
    });
})