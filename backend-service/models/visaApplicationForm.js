const mongoose = require("mongoose");

const visaApplicationFormSchema = new mongoose.Schema(
  {
    applicationSchema: {
      type: [mongoose.Schema.Types.Mixed], // Store schema in db
    },
    visaIssuer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaIssuer",
    },
    visaType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaType",
    },
  },
  {
    collection: "visaApplicationForms",
  }
);

const VisaApplicationForm = mongoose.model(
  "VisaApplicationForm",
  visaApplicationFormSchema
);

module.exports = VisaApplicationForm;
