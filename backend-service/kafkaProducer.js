const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "backend-service",
  brokers: ["kafka:29092"], // Adjust according to your setup
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka producer connected");
};

const publishMessage = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("Message published", message);
  } catch (error) {
    console.error("Error publishing message", error);
  }
};

module.exports = { connectProducer, publishMessage };
