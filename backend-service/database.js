const mongoose = require("mongoose");

const connectDB = async () => {
  require("dotenv").config();
  const username = process.env.DB_USER;
  const password = encodeURIComponent(process.env.DB_PASS);
  const mongoURI = `mongodb://${username}:${password}@streetvision-db:27017/streetvision?authSource=admin`;

  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    await mongoose.connect(mongoURI, options);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
