const Job = require("../models/survJobModel");
const Camera = require("../models/cameraModel");
const Video = require("../models/videoModel");
const { publishMessage } = require("../kafkaProducer");
const POI = require("../models/poiModel");

// Validates coords, radius, creates job for inference which is stored in mongo
// payload: api/createSurvJob
// {
//     "poiId": "660a9744f4959b7a6cb7c3e0",
//     "coordinates": [-1.464443569751507, 53.37767708782339],
//     "radius": 5000, // meters
//     "fromDate": "2024-02-15T13:04:00Z",
//     "toDate": "2024-03-07T13:04:00Z"
//   }

// FIXME: remove location from POI model
// FIXME: consider adding ids to kaf msg

exports.createJob = async (req, res) => {
  try {
    const { poiId, location, radius, fromDate, toDate, coordinates } = req.body;

    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid or missing coordinates" });
    }
    if (typeof radius !== "number" || radius <= 0) {
      return res.status(400).json({ error: "Invalid or missing radius" });
    }

    const [longitude, latitude] = coordinates.map((coord) => parseFloat(coord));

    if (
      isNaN(longitude) ||
      isNaN(latitude) ||
      longitude < -180 ||
      longitude > 180 ||
      latitude < -90 ||
      latitude > 90
    ) {
      return res
        .status(400)
        .json({ error: "Invalid longitude or latitude values." });
    }

    // Find active cams near job loc
    const camsInRange = await Camera.find({
      geometry: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
      is_active: true,
    });

    // Find videos for active cameras within the time range
    const relevantVideos = await Video.find({
      camera_id: { $in: camsInRange.map((camera) => camera._id) },
      start_time: { $lte: toDate },
      end_time: { $gte: fromDate },
    });
    if (relevantVideos.length === 0) {
      return res
        .status(404)
        .json({ error: "No videos found for the given time range" });
    }

    const poiDocument = await POI.findById(poiId);
    if (!poiDocument) {
      return res.status(404).json({ error: "POI not found" });
    }

    // Create job with references to active cameras
    const newJob = await Job.create({
      poi: poiId,
      location,
      radius: radius,
      fromDate,
      toDate,
      cameras: camsInRange.map((camera) => camera._id),
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      videos: relevantVideos.map((video) => video._id),
      status: "video_analysis_pending",
    });

    // Publish job to Kafka (for vid processing later on FIXME: check if vid paths vis)
    const jobDetails = {
      jobId: newJob._id.toString(),
      poiId,
      poiDesc: poiDocument.description,
      location,
      radius,
      fromDate,
      toDate,
      jobType: "video_analysis",
      topN: 30,
      videos: relevantVideos.map((video) => video.vid_location.toString()),
    };
    // cameraIds: camsInRange.map((camera) => camera.cam_name.toString()),

    await publishMessage("video_processing_jobs", jobDetails)
      .then(() => console.log("Job details published to Kafka"))
      .catch((error) =>
        console.error("Failed to publish job details to Kafka", error)
      );

    res.status(201).json({ job: newJob, camsInRange, relevantVideos });
  } catch (error) {
    console.error("Failed to create job:", error);
    res
      .status(500)
      .json({ error: "Failed to create job", details: error.message });
  }
};

// fetch job by ID
// exports.getJobById = async (req, res) => {
//   try {
//     const jobId = req.params.jobId;
//     const job = await Job.findById(jobId);

//     if (!job) {
//       return res.status(404).json({ message: "Job not found" });
//     }

//     const updatedClipResults = job.details.clip_results.map((clip) => {
//       return {
//         ...clip,
//         // remove . prefix
//         inference: `http://localhost:9000/${clip.inference.replace(",", "")}`,
//         orig_img: `http://localhost:9000/${clip.orig_img.replace(",", "")}`,
//       };
//     });

//     const updatedJob = {
//       ...job._doc,
//       details: {
//         ...job.details,
//         clip_results: updatedClipResults,
//       },
//     };

//     res.json(updatedJob);
//   } catch (error) {
//     console.error("Error fetching job:", error);
//     res.status(500).json({ message: "Error fetching job" });
//   }
// };

exports.getJobById = async (req, res) => {
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
        };
      })
    );

    const updatedJob = {
      ...job,
      details: {
        ...job.details,
        clip_results: updatedClipResults,
      },
    };

    res.json(updatedJob);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Error fetching job" });
  }
};
