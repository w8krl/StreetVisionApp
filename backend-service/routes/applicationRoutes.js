const express = require("express");
const router = express.Router();
const cameraController = require("../controllers/cameraController");

// router.get("/forms/:id", applicationController.getApplicationForm);

router.get("/cameras", cameraController.getCameras);
// router.post("/applications", applicationController.submitApplication);

module.exports = router;
