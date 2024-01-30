import React, { useState } from "react";
import axios from "axios";

const AddWorkflow = () => {
  const [workflowName, setWorkflowName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/api/visa-workflows", {
        name: workflowName,
        steps: [],
      });
      setWorkflowName("");
    } catch (error) {
      console.error("Error adding workflow", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Workflow</h2>
      <input
        type="text"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        placeholder="Workflow Name"
      />
      <button type="submit">Add Workflow</button>
    </form>
  );
};

export default AddWorkflow;
