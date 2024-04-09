const express = require("express");
const cors = require("cors");

// Producer and consumer
const { connectProducer } = require("./kafkaProducer");
const { connectConsumer } = require("./kafkaConsumer");

const app = express();
app.use(cors({ origin: "*" }));
app.use("/media-store", express.static("/media-store"));

const port = process.env.PORT || 9000;

const mongoose = require("mongoose");

// Connect to Kafka Producer, Consumer
connectProducer().then(() => console.log("Connected to Kafka Producer"));

connectConsumer()
  .then(() => console.log("Connected to Kafka Consumer"))
  .catch((err) => {
    console.error("Failed to connect Kafka consumer:", err);
  });

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
app.use("/api", applicationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle shutdown
const shutdown = async () => {
  console.log("Shutting down...");
  await consumer.disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
