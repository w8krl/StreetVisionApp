const express = require("express");
const app = express(); 
const port = process.env.PORT || 3001;

// Use Express JSON middleware
app.use(express.json()); // 'app' is now defined, so you can use it

// Kafka Consumer and Producer setup
const kafka = require("kafka-node");
// const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
// const consumer = new Consumer(
//   client,
//   [{ topic: "workflow-events", partition: 0 }],
//   { autoCommit: true }
// );xw

// consumer.on("message", function (message) {
//   console.log("Received message:", message);
// });

// consumer.on("error", function (error) {
//   console.error("Consumer got an error", error);
// });

app.get("/", (req, res) => {
  res.send("Hi, I am the Kafka consumer service! I'm listening...");
});

// // Endpoint to trigger Kafka Producer
// app.post("/workflow/:workflowId/steps/:stepId/complete", (req, res) => {
//   const { workflowId, stepId } = req.params;
//   const userId = req.body.userId; // Get 'userId' from request body

//   sendWorkflowStepCompletion(workflowId, stepId, userId);
//   res.status(200).send("Workflow step completion event sent to Kafka.");
// });

// // Start the Express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { app, consumer };
