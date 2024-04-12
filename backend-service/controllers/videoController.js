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

exports.streamVideo = async (req, res) => {
  try {
    const { videoId, frameNumber } = req.params;

    // Retrieve video details from the database
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).send("Video not found");
    }

    const videoPath = video.vid_location.replace(".", "");
    const FPS = video.frame_rate || 30;

    const frameTimestamp = frameNumber / FPS;
    const startTime = Math.max(0, frameTimestamp - 5);
    const duration = 10;

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    let start, end;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    } else {
      start = 0;
      end = fileSize - 1;
    }

    const chunkSize = end - start + 1;
    const contentLength =
      start === 0 && end === fileSize - 1 ? fileSize : chunkSize;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    };

    res.writeHead(range ? 206 : 200, headers);

    // Create ffmpeg process adn stream the video
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

    ffmpegProcess.stdout.on("data", (chunk) => {
      res.write(chunk);
    });

    ffmpegProcess.stdout.on("end", () => {
      res.end();
    });

    ffmpegProcess.stderr.on("data", (data) => {
      console.error(`ffmpeg stderr: ${data}`);
    });

    ffmpegProcess.on("error", (error) => {
      console.error(`Error with ffmpeg: ${error}`);
      res.end();
    });

    ffmpegProcess.on("exit", (code, signal) => {
      console.log(`ffmpeg exited with code ${code} and signal ${signal}`);
      res.end();
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
};
