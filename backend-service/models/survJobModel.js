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
    composition: {
      state: { type: String, default: "pending" },
      inferenceScope: { type: [Number], default: [] },
      date_compiled: { type: Date },
      approvedInferences: [{ type: Number, default: [] }],
      rejectedInferences: [{ type: Number, default: [] }],
    },
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
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
