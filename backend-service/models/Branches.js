const mongoose = require("mongoose");
const branchSchema = new mongoose.Schema({
  name: String,
  location: String,
  address: String,
  phone: String,
  email: String,
  operatingHours: String,
  additionalInfo: String,
});

const branchesSchema = new mongoose.Schema({
  region: {
    country: String,
    servicename: String,
    branches: [branchSchema],
  },
});

const Branches = mongoose.model("Branches", branchesSchema);

module.exports = Branches;
