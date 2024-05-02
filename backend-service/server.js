const app = require("./app");
const connectDB = require("./database");
const { connectProducer } = require("./kafkaProducer");
const { connectConsumer } = require("./kafkaConsumer");

//  MongoDB connection
require("dotenv").config();

const port = process.env.PORT || 9000;

// Connect to Kafka
async function connectServices() {
  try {
    await connectProducer();
    console.log("Connected to Kafka Producer");
    await connectConsumer();
    console.log("Connected to Kafka Consumer");
  } catch (err) {
    console.error("Failed to connect Kafka consumer:", err);
  }
}

connectServices();
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle shutdown
process.on("SIGINT", () => {
  console.log("Shutting down...");
  mongoose.disconnect();
  process.exit(0);
});
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  mongoose.disconnect();
  process.exit(0);
});
