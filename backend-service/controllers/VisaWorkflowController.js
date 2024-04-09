const VisaApplicationForm = require("../models/VisaApplicationForm");

// Get app form by id

exports.getApplicationForm = async (req, res) => {
  try {
    const formId = req.params.id;
    const applicationForm = await VisaApplicationForm.findById(formId);

    if (!applicationForm) {
      return res.status(404).json({ message: "Application form not found" });
    }

    res.json(applicationForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
