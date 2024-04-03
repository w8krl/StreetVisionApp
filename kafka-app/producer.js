const kafka = require("kafka-node");
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
const producer = new Producer(client);

function sendWorkflowStepCompletion(workflowId, stepId, userId) {
  const payloads = [
    {
      topic: "workflow-events",
      messages: JSON.stringify({
        workflow_id: workflowId,
        step_id: stepId,
        user_id: userId,
        status: "completed",
      }),
    },
  ];

  producer.send(payloads, (error, result) => {
    console.info("Sent payload to Kafka:", payloads);
    if (error) {
      console.error("Sending payload failed:", error);
    } else {
      console.log("Sending payload result:", result);
    }
  });
}

producer.on("ready", () => {
  console.log("Kafka Producer is connected and ready.");
});

producer.on("error", (error) => {
  console.error("Producer got an error", error);
});

module.exports = { sendWorkflowStepCompletion }; // Exporting the function to be used in other parts of your application
