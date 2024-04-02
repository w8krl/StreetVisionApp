const mongoose = require("mongoose");

// Video schema
const videoSchema = new mongoose.Schema({
  camera_name: String,
  start_time: Date,
  end_time: Date,
  frame_rate: Number,
  processed: Boolean,
  vid_location: String,
  duration: Number,
  // camera: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Camera",
  // },
});

module.exports = mongoose.model("Video", videoSchema);
