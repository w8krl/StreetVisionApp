const Video = require("../models/videoModel");
const { publishMessage } = require("../kafkaProducer");
const { spawn } = require("child_process");
const fs = require("fs");

const Camera = require("../models/cameraModel");
const Job = require("../models/survJobModel");

exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos); // Sending JSON data
  } catch (error) {
    console.error("Failed to fetch camera data", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

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

//  Video composer

exports.composeVid = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId).lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const updatedClipResults = await Promise.all(
      job.details.clip_results.map(async (clip) => {
        const video = await Video.findOne({ vid_location: clip.video }).lean();
        if (!video) {
          return clip;
        }
        const camera = await Camera.findById(video.camera_id).lean();
        if (!camera) {
          return clip;
        }
        return {
          ...clip,
          inference: `http://localhost:9000/${clip.inference.replace(
            "./",
            ""
          )}`,
          orig_img: `http://localhost:9000/${clip.orig_img.replace("./", "")}`,
          lat: camera.geometry.coordinates[1],
          lng: camera.geometry.coordinates[0],
          camera_name: camera.cam_name,
          location: camera.location,
          status: clip.status, // Adding status to know approved/pending/rejected
        };
      })
    );

    // Only forward approved clips to Kafka for video composition
    const approvedClips = updatedClipResults.filter(
      (clip) => clip.status === "approved"
    );

    if (approvedClips.length > 0) {
      await publishMessage("composition_jobs", {
        jobId,
        jobType: "composition_job",
        clips: approvedClips,
      })
        .then(() => {
          console.log("Composition job details published to Kafka");
          res.json({
            message: "Video composition initiated",
            data: approvedClips,
          });
        })
        .catch((error) => {
          console.error(
            "Failed to publish composition job details to Kafka",
            error
          );
          res.status(500).json({ message: "Failed to publish to Kafka" });
        });
    } else {
      res
        .status(404)
        .json({ message: "No approved clips available for composition" });
    }
  } catch (error) {
    console.error("Error during video composition setup:", error);
    res.status(500).json({ message: "Error during video composition setup" });
  }
};
