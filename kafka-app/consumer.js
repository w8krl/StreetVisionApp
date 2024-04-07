// const kafka = require("kafka-node");
// const Consumer = kafka.Consumer;
// const client = new kafka.KafkaClient({ kafkaHost: "kafka:9092" });
// const consumer = new Consumer(
//   client,
//   [{ topic: "workflow-events", partition: 0 }],
//   { autoCommit: true }
// );

// consumer.on("message", function (message) {
//   console.log("Message received:", message);
// });

// consumer.on("error", function (error) {
//   console.error("Consumer got an error", error);
// });

// module.exports = consumer;
