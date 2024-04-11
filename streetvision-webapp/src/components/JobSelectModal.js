import React, { useState, useEffect } from "react";
import { Tab, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const JobSelectModal = ({ poiId }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/poi-job-details/id/${poiId}`
        );
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data); // Assuming this returns an array of job objects
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (poiId) {
      fetchJobs();
    }
  }, [poiId]);

  return (
    <Tab.Container
      key={jobs.length > 0 ? jobs[0]._id : "initialKey"} // Use the first job's _id as a key, or "initialKey" when jobs array is empty
      defaultActiveKey={jobs.length > 0 ? jobs[0]._id : "defaultKey"}
    >
      {/* <h4>Jobs for POI ID: {poiId}</h4> */}
      <Row>
        <Col md={4}>
          <p>Select job to view status details</p>
          <Nav variant="pills" className="flex-column">
            {jobs.map(
              (
                job,
                idx // Note the change here for correct indexing
              ) => (
                <Nav.Item key={job._id}>
                  <Nav.Link eventKey={job._id}>Job {idx + 1}</Nav.Link>
                </Nav.Item>
              )
            )}
          </Nav>
        </Col>
        <Col md={8}>
          <Tab.Content>
            {jobs.map((job) => (
              <Tab.Pane eventKey={job._id} key={job._id}>
                <h5>Job ID: {job._id}</h5>
                <p>Status: {job.status}</p>
                <Link to={`/job/review/${job._id}`}>View Job Details</Link>
                {/* Additional job details could go here */}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default JobSelectModal;
