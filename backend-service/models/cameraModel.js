const mongoose = require("mongoose");

const cameraSchema = new mongoose.Schema({
  cam_name: String,
  active_date: Date,
  cam_no: Number,
  is_active: Boolean,
  provider: {
    is_residential: Boolean,
    onboard_date: Date,
    provider_id: String,
  },
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

cameraSchema.index({ geometry: "2dsphere" });

module.exports = mongoose.model("Camera", cameraSchema);
