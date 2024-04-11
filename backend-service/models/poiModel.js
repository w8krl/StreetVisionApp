const mongoose = require("mongoose");

const poiSchema = new mongoose.Schema(
  {
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    caseNumber: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: false,
      enum: ["low", "medium", "high"], // Only allow these values
    },
  },
  {
    timestamps: true,
  }
);

const POI = mongoose.model("POI", poiSchema);

module.exports = POI;
