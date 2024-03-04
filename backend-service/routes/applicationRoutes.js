const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

router.get("/forms/:id", applicationController.getApplicationForm);

router.post("/applications", applicationController.submitApplication);

module.exports = router;
