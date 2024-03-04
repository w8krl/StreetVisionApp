const kafkaBrokerUrl = process.env.KAFKA_BROKER_URL;

const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "applicant-service",
  brokers: [kafkaBrokerUrl],
});

const producer = kafka.producer();

const connectProducer = async () => {
  await producer.connect();
};

module.exports = { producer, connectProducer };
