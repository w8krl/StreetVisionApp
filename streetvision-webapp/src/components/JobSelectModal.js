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
        setJobs(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (poiId) {
      fetchJobs();
    }
  }, [poiId]);

  const defaultJobKey =
    jobs.length > 0 ? jobs[jobs.length - 1]._id : "defaultKey";

  const getTimeTaken = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const milliseconds = end - start; // Difference in milliseconds

    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  return (
    <Tab.Container
      key={jobs.length > 0 ? jobs[0]._id : "initialKey"}
      defaultActiveKey={defaultJobKey}
    >
      <Row>
        <Col md={4}>
          <p>Select job to view status details</p>
          <Nav variant="pills" className="flex-column">
            {jobs.map((job, idx) => (
              <Nav.Item key={job._id}>
                <Nav.Link eventKey={job._id}>Job {idx + 1}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Col>
        <Col md={8}>
          <Tab.Content>
            {jobs.map((job) => (
              <Tab.Pane eventKey={job._id} key={job._id}>
                <h5>Job ID: {job._id}</h5>

                <h5> Details</h5>
                <table className="table table-striped">
                  <tbody>
                    <tr>
                      <td>From Date </td>
                      <td>{new Date(job.fromDate).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>To Date: </td>
                      <td>{new Date(job.toDate).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Videos analysed</td>
                      <td>{job.details.video_stats.length}</td>
                    </tr>
                    <tr>
                      <td>Radius Selection</td>
                      <td>{job.radius} (meters)</td>
                    </tr>
                    <tr>
                      <td>Cameras in radius</td>
                      <td>{job.cameras.length}</td>
                    </tr>
                    <tr>
                      <td>Total frames analysed</td>
                      <td>{job.details.total_frames_processed}</td>
                    </tr>
                    <tr>
                      <td>Total person detections analysed</td>
                      <td>{job.details.total_persons_detected}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <h6>Job Processing Summary</h6>
                        <ul>
                          <li>Status: {job.status}</li>
                          <li>
                            Job created:{" "}
                            {new Date(job.details.start_time).toLocaleString()}
                          </li>
                          <li>
                            Finished:{" "}
                            {new Date(job.details.end_time).toLocaleString()}
                          </li>
                          <li>
                            Time taken:{" "}
                            {getTimeTaken(
                              job.details.start_time,
                              job.details.end_time
                            )}
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {"Next Action: "}
                {job.status !== "pending" && (
                  <Link to={`/job/review/${job._id}`}>Review Job</Link>
                )}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default JobSelectModal;
