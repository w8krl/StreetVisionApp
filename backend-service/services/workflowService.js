const axios = require("axios");
const workflowServiceHostname = "workflow-service";
const workflowServicePort = "9000";

exports.fetchApplicationForm = async (formId) => {
  try {
    const url = `http://${workflowServiceHostname}:${workflowServicePort}/application-forms/${formId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching application form from workflow service:",
      error
    );
    throw error;
  }
};
