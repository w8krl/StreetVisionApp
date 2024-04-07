const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    poi: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "POI",
      required: true,
    },
    location: String,
    radius: Number,
    fromDate: Date,
    toDate: Date,
    cameras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Camera",
      },
    ],

    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    status: String,
    details: mongoose.Schema.Types.Mixed,
  },
  {
    timestamps: true, // Optionally include timestamp information for the job
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
