const express = require("express");
const cors = require("cors");

require("./kafkaConsumer");

const app = express();
app.use(cors({ origin: "*" }));

const port = process.env.PORT || 9000;

const mongoose = require("mongoose");

// Connect to Kafka Producer
connectProducer().then(() => console.log("Connected to Kafka Producer"));

// import routes
const applicationRoutes = require("./routes/applicationRoutes");

require("dotenv").config();

// MongoDB connection URI
const username = process.env.DB_USER;
const password = encodeURIComponent(process.env.DB_PASS);
const mongoURI = `mongodb://${username}:${password}@streetvision-db:27017/streetvision?authSource=${username}}`;
// const mongoURI = process.env.MONGODB_URI;
console.log(mongoURI);

// Connect to Workflow MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB: ", error));

// Middleware
app.use(express.json());

// Include routes
// app.use("/api", visaWorkflowRoutes);
app.use("/api", applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
