import React, { useState, useEffect } from "react";
import { Layout } from "../components";
import { Button, Row, Col, Image, Badge } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import Box from "../components/Box";
import Alert from "react-bootstrap/Alert";
import { CiCircleInfo } from "react-icons/ci";

import "bootstrap/dist/css/bootstrap.min.css";

const JobReview = () => {
  const [jobData, setJobData] = useState(null);
  const [inferences, setInferences] = useState([]);

  const [show, setShow] = useState(true);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobId = "6615695b91597ec1a311ccdd";
        const response = await fetch(
          `http://localhost:9000/api/jobs/id/${jobId}`
        );
        const data = await response.json();
        setJobData(data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobData();
  }, []);

  useEffect(() => {
    if (jobData) {
      const sortedInferences = jobData.details.clip_results.sort(
        (a, b) => b.score - a.score
      );
      setInferences(sortedInferences);
    }
  }, [jobData]);
  const handleApproval = (index, approved) => {
    console.log(`Inference ${index} approved: ${approved}`);
  };

  return (
    <Layout>
      <h2>Inference Verification </h2>

      <Alert variant="info" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>Info</Alert.Heading>
        <p>
          <CiCircleInfo height={4} />
          You have a total of{" "}
          <b>{jobData ? jobData.details.clip_results.length : "..."}</b> images
          to review. Please review each image and approve or reject it, once
          done the frames will be compiled into a video.
        </p>
        <ul>
          <li>Job ID: {jobData ? jobData._id : "Loading..."} </li>
          <li>
            Frames analysed:{" "}
            {jobData ? jobData.details.total_frames_processed : "Loading..."}{" "}
          </li>
          <li>
            Persons analysed:{" "}
            {jobData ? jobData.details.total_persons_detected : "Loading..."}{" "}
          </li>
          <li>Search Interval: 30 frames</li>
        </ul>
      </Alert>
      <p>
        Total Images to Review:{" "}
        {jobData ? jobData.details.clip_results.length : "Loading..."}
      </p>
      <Row>
        {inferences.map((inference, index) => (
          <Col key={index} xs={12} md={6} lg={3} className="mb-3">
            <Box
              key={index}
              title={
                <Badge bg="secondary">
                  Score: {inference.score.toFixed(2)}
                </Badge>
              }
              content={
                <Image
                  src={inference.orig_img}
                  style={{
                    maxWidth: "100%",
                    height: "100%",
                    boxShadow: " 0 0 5px rgba(0, 0, 0, 0.1)",
                  }}
                />
              }
              footer={
                <div className="d-flex justify-content-center w-100 p-2">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApproval(index, true)}
                    style={{ marginLeft: "5px" }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleApproval(index, false)}
                    style={{ marginLeft: "5px" }}
                  >
                    Reject
                  </Button>
                </div>
              }
            />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default JobReview;
