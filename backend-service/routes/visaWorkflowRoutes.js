const express = require("express");
const router = express.Router();
const visaWorkflowController = require("../controllers/VisaWorkflowController");

// // Create a new Visa Workflow
// router.post("/visa-workflows", visaWorkflowController.createVisaWorkflow);

// // Get all Visa Workflows
// router.get("/visa-workflows", visaWorkflowController.getAllVisaWorkflows);

// Get app form by id
router.get("/application-form/:id", visaWorkflowController.getApplicationForm);

module.exports = router;
