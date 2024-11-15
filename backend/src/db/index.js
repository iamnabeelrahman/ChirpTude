const mongoose = require("mongoose");
const DB_NAME = require("../constants");
require("dotenv").config(); 


const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(`MongoDb connected!! DB Host: ${connectionInstance.connection.host}`);

  } catch (error) {
    console.error(" MongoDB connection Error: ", error);
  }
};

module.exports = dbConnect; 