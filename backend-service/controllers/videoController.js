const Video = require("../models/videoModel");
const { spawn } = require("child_process");
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

exports.streamVideo = (req, res) => {
  const videoPath = "/media-store/upl/peoplewalking.mp4";
  // const { videoPath, frameID } = req.query;
  const frameID = 2790;
  const FPS = 30; // Example frame rate; adjust this based on your video or retrieve dynamically

  // Convert frameID to timestamp in seconds
  const frameTimestamp = frameID / FPS;
  const startTime = Math.max(0, frameTimestamp - 5); // Start 5 seconds before the frame timestamp
  const duration = 10; // Duration to stream

  // Set response headers
  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Accept-Ranges": "bytes",
  });

  // ffmpeg command as before, using startTime and duration calculated above
  const ffmpegProcess = spawn("ffmpeg", [
    "-ss",
    String(startTime),
    "-t",
    String(duration),
    "-i",
    videoPath,
    "-f",
    "mp4",
    "-movflags",
    "frag_keyframe+empty_moov",
    "-vcodec",
    "libx264",
    "-preset",
    "veryfast",
    "-acodec",
    "aac",
    "-",
  ]);

  ffmpegProcess.stdout.pipe(res);
  // Error handling remains the same as previously shown
};
