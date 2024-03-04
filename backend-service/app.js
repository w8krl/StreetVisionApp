const express = require("express");
const cors = require("cors");
const { connectProducer } = require("./kafkaProducer");

const app = express();
app.use(cors());

const port = process.env.PORT || 9001;

const mongoose = require("mongoose");

// Connect to Kafka Producer
connectProducer().then(() => console.log("Connected to Kafka Producer"));

// import routes
const visaWorkflowRoutes = require("./routes/visaWorkflowRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

require("dotenv").config();

// MongoDB connection URI
const username = process.env.BRANCH_DB_USERNAME;
const password = encodeURIComponent(process.env.BRANCH_DB_PASSWORD);
const mongoURI = `mongodb://${username}:${password}@branch-svc-db:27017/branchdb?authSource=admin`;

// Connect to Workflow MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB: ", error));

// Middleware
app.use(express.json());

// Include routes
app.use("/api", visaWorkflowRoutes);
app.use("/api", applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
