const Video = require("../models/videoModel");
// const { producer } = require("../kafkaProducer");

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos); // Sending JSON data
  } catch (error) {
    console.error("Failed to fetch camera data", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

// exports.getApplicationForm = async (req, res) => {
//   try {
//     const formId = req.params.id;
//     const applicationForm = await workflowService.fetchApplicationForm(formId);
//     res.json(applicationForm);
//   } catch (error) {
//     console.error("Error in getApplicationForm:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.submitApplication = async (req, res) => {
//   try {
//     const { applicationFormId, applicantData } = req.body;

//     // Create and save the new application instance
//     const newApplicationInstance = new ApplicationInstance({
//       applicationFormId,
//       applicantData,
//     });

//     await newApplicationInstance.save();

//     // create kafka message
//     await producer.send({
//       topic: "application-submitted",
//       messages: [
//         {
//           value: JSON.stringify({
//             applicationId: newApplicationInstance._id,
//             applicationFormId: newApplicationInstance.applicationFormId,
//             event_desc: "ApplicationSubmitted",
//             event_timestamp: new Date(),
//           }),
//         },
//       ],
//     });

//     res.status(201).json({
//       message: "Application submitted successfully",
//       applicationId: newApplicationInstance._id,
//     });
//   } catch (error) {
//     console.error("Error in submitApplication:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
