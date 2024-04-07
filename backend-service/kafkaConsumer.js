// kafkaConsumer.js
const { Kafka } = require("kafkajs");
const Job = require("./models/survJobModel");

const kafka = new Kafka({
  clientId: "streetvision-backend",
  brokers: ["kafka:29092"],
});

const consumer = kafka.consumer({ groupId: "video-processing-status-group" });

const connectConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: "video_processing_status",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const content = JSON.parse(message.value.toString());
      console.log(`Received message: ${message.value.toString()}`);

      try {
        const { jobId, status, details } = content;
        await Job.findByIdAndUpdate(
          jobId,
          { $set: { status, details } },
          { new: true }
        );
        console.log(`Job ${jobId} updated successfully with status: ${status}`);
      } catch (err) {
        console.error(`Error updating job: ${err.message}`);
      }
    },
  });

  console.log("Kafka Consumer connected and listening.");
};

module.exports = { connectConsumer };
