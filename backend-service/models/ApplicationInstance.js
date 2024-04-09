// Allows dynamic creation of application instances (depending on the application form)
const mongoose = require("mongoose");

const ApplicationInstanceSchema = new mongoose.Schema({
  applicationFormId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VisaApplicationForm",
    required: true,
  },
  applicantData: {
    type: Object,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Submitted",
  },
});

module.exports = mongoose.model(
  "ApplicationInstance",
  ApplicationInstanceSchema
);
