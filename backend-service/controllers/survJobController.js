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
      cameraIds: camsInRange.map((camera) => camera.cam_name.toString()),
      videoIds: relevantVideos.map((video) => video.vid_location.toString()),
    };

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
