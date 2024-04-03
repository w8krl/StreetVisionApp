const express = require("express");
const router = express.Router();
const cameraController = require("../controllers/cameraController");
const videoController = require("../controllers/videoController");
const poiController = require("../controllers/poiController");
const jobController = require("../controllers/survJobController");

// router.get("/forms/:id", applicationController.getApplicationForm);

// cams
router.get("/cameras", cameraController.getCameras);
router.get("/camerasNear", cameraController.getCamerasNear);

// videos
router.get("/videos", videoController.getVideos);
router.post("/createPoi", poiController.createPOI);
router.get("/getPoiStatus", poiController.getPOIs);
// router.post("/applications", applicationController.submitApplication);

// Create surveillance job
router.post("/createSurvJob", jobController.createJob);

module.exports = router;
