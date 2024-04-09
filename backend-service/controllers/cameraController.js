const Camera = require("../models/cameraModel");
// const { producer } = require("../kafkaProducer");

exports.getCameras = async (req, res) => {
  try {
    const cameras = await Camera.find();
    res.json(cameras); // Sending JSON data
  } catch (error) {
    console.error("Failed to fetch camera data", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

// Search cams by location
exports.getCamerasNear = async (req, res) => {
  let { longitude, latitude, radius } = req.query;
  const maxDistance = radius ? parseInt(radius, 10) : 10000;

  longitude = parseFloat(longitude);
  latitude = parseFloat(latitude);

  console.log(longitude, latitude, radius, maxDistance);

  if (
    isNaN(longitude) ||
    isNaN(latitude) ||
    longitude < -180 ||
    longitude > 180 ||
    latitude < -90 ||
    latitude > 90
  ) {
    return res.status(400).send("Invalid longitude or latitude values.");
  }

  try {
    const cameras = await Camera.find({
      geometry: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    res.json(cameras);
  } catch (error) {
    console.error("Error fetching nearby cameras", error);
    res.status(500).send("Error fetching nearby cameras");
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
