import React from "react";
import WorkflowList from "../../workflow/WorkflowList";
import AddWorkflow from "../../workflow/AddWorkflow";

const Workflow = () => {
  return (
    <div className="App">
      <h1>Workflow Management</h1>
      {/* <AddWorkflow /> */}
      <WorkflowList />
    </div>
  );
};

export default Workflow;
