const express = require("express");
const app = express(); // Define 'app' here
const port = process.env.PORT || 3001;
const { sendWorkflowStepCompletion } = require("./producer");

// Use Express JSON middleware
app.use(express.json()); // 'app' is now defined, so you can use it

// Kafka Consumer and Producer setup
const kafka = require("kafka-node");
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
const consumer = new Consumer(
  client,
  [{ topic: "workflow-events", partition: 0 }],
  { autoCommit: true }
);

consumer.on("message", function (message) {
  console.log("Received message:", message);
});

consumer.on("error", function (error) {
  console.error("Consumer got an error", error);
});

app.get("/", (req, res) => {
  res.send("Kafka Consumer is running.");
});

// Endpoint to trigger Kafka Producer
app.post("/workflow/:workflowId/steps/:stepId/complete", (req, res) => {
  const { workflowId, stepId } = req.params;
  const userId = req.body.userId; // Get 'userId' from request body

  sendWorkflowStepCompletion(workflowId, stepId, userId);
  res.status(200).send("Workflow step completion event sent to Kafka.");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, consumer };
