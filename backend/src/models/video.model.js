const mongoose = require("mongoose");
const mongooseAggregatePaginate = require( "mongoose-aggregate-paginate-v2");


const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  
    },

    duration: {
      type: Number,
      required: true
    },

    views: {
      type: Number,
      default: 0
    },

    videoFile: {
        //cloudinary URL
        type: String,
        required: true,
    },

    thumbnail: {
        //cloudinary URL
        type: String,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const Video = new mongoose.model("Video", videoSchema);
module.exports = { Video };
