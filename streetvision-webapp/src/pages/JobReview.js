import React, { useState, useEffect } from "react";
import { Layout } from "../components";
import { Button, Row, Col, Image, Badge, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Box from "../components/Box";
import Alert from "react-bootstrap/Alert";
import { CiCircleInfo } from "react-icons/ci";
import MapView from "../components/MapView";
import { renderToStaticMarkup } from "react-dom/server";
import { GiCctvCamera } from "react-icons/gi";
import L from "leaflet";
import { useParams } from "react-router-dom";
import MediaCarousel from "../components/MediaCarousel";
import "bootstrap/dist/css/bootstrap.min.css";

const JobReview = () => {
  const [jobData, setJobData] = useState(null);
  const [inferences, setInferences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { jobId } = useParams();

  const [currentInference, setCurrentInference] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [show, setShow] = useState(true);
  const [mapCenter, setMapCenter] = useState({});

  const [approvedInferences, setApprovedInferences] = useState([]);
  const [rejectedInferences, setRejectedInferences] = useState([]);
  const [pendingInferences, setPendingInferences] = useState([]);

  const [showDetails, setShowDetails] = useState(false);

  const createCustomIcon = () => {
    const svgMarkup = renderToStaticMarkup(
      <GiCctvCamera size={24} color="green" />
    );
    const iconUrl = `data:image/svg+xml;base64,${btoa(svgMarkup)}`;
    return new L.Icon({
      iconUrl,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [1, -24],
    });
  };

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        // const jobId = "6618022d7448db43fbf703a7";
        const response = await fetch(
          `http://localhost:9000/api/jobs/id/${jobId}`
        );
        const data = await response.json();
        setJobData(data);

        // Setting up approval buckets (default is pending from streetvision )
        const { clip_results } = data.details;
        setApprovedInferences(
          clip_results.filter((clip) => clip.status === "approved")
        );
        setRejectedInferences(
          clip_results.filter((clip) => clip.status === "rejected")
        );
        setPendingInferences(
          clip_results.filter((clip) => clip.status === "pending")
        );

        if (data.geometry && data.geometry.coordinates) {
          const [lng, lat] = data.geometry.coordinates;
          setMapCenter({ lat, lng });
        }

        const uniqueCoords = new Map();
        data.details.clip_results.forEach((clip) => {
          const coordKey = `${clip.lat},${clip.lng}`;
          if (!uniqueCoords.has(coordKey)) {
            uniqueCoords.set(coordKey, clip);
          }
        });

        // for map
        const markers = Array.from(uniqueCoords.values()).map((clip) => ({
          key: `${clip.lat},${clip.lng}`,
          position: [clip.lat, clip.lng],
          icon: createCustomIcon(),
          popup: (
            <div>
              <h3>Location Data</h3>
              <p>
                <b>Score:</b> {clip.score}
              </p>
              <p>
                <b>Frame Number:</b> {clip.frame_number}
              </p>
              <p>
                <b>From Date:</b> {new Date(data.fromDate).toLocaleString()}
              </p>
              <p>
                <b>To Date:</b> {new Date(data.toDate).toLocaleString()}
              </p>
              <Button size="sm">View Clip</Button>
            </div>
          ),
        }));

        setMarkers(markers);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobData();
  }, []);

  useEffect(() => {
    if (jobData) {
      console.log(jobData);

      const sortedInferences = jobData.details.clip_results.sort(
        (a, b) => b.score - a.score
      );
      setInferences(sortedInferences);
    }
  }, [jobData]);

  const handleDecision = async (index, decision) => {
    const url = `http://localhost:9000/api/jobs/${jobId}/inferences/${index}`;
    const options = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision }),
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to update decision status");
      const updatedInference = await response.json();

      // Update the state of all inferences to reflect change
      const updatedInferences = inferences.map((inf) =>
        inf.frame_number === updatedInference.frame_number
          ? { ...inf, status: decision }
          : inf
      );
      setInferences(updatedInferences);

      // Update the respective buckets for approved or rejected
      if (decision === "approve") {
        setApprovedInferences((prev) => [...prev, updatedInference]);
        setPendingInferences((prev) =>
          prev.filter(
            (inf) => inf.frame_number !== updatedInference.frame_number
          )
        );
        toast.success("Inference added to approved scope");
      } else {
        setRejectedInferences((prev) => [...prev, updatedInference]);
        setPendingInferences((prev) =>
          prev.filter(
            (inf) => inf.frame_number !== updatedInference.frame_number
          )
        );
        toast.error("Inference added to rejected scope");
      }
      handleNextInference();
    } catch (error) {
      console.error("Error updating decision status:", error);
      toast.error("Failed to update inference status. Please try again.");
    }
  };

  const handleShowModal = (index) => {
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrevInference = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : inferences.length - 1
    );
  };

  const handleNextInference = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % inferences.length);
  };

  const ShowJobDetails = () => {
    return (
      <>
        <h2>Job Details</h2>
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
      </>
    );
  };

  const composeVideo = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/video/compose/${jobId}`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Failed to initiate video composition");
      toast.success(
        "Video composition initiated, go to video encoding to monitor progress."
      );
    } catch (error) {
      console.error("Error initiating video composition:", error);
      toast.error("Failed to initiate video composition.");
    }
  };

  return (
    <Layout>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1>Identity Verification</h1>
      <h6>
        Inference Job ID: {jobId}{" "}
        <span
          style={{ color: "color(srgb 0.0458 0.3187 0.6166)" }}
          onClick={() => setShowDetails(true)}
        >
          {" "}
          - <CiCircleInfo></CiCircleInfo>View Details
        </span>
      </h6>
      <Row>
        <Col lg={12}>
          <div className="d-flex align-items-center pb-2">
            <p className="mb-0 margin-right-10">Pending Images:</p>
            <Badge bg="warning" text="dark" className="margin-right-10">
              {jobData ? pendingInferences.length : "Loading..."}
            </Badge>
            <p className="mb-0 margin-right-10">Approved Images:</p>
            <Badge bg="success" text="light" className="margin-right-10">
              {jobData ? approvedInferences.length : "Loading..."}
            </Badge>
            <p className="mb-0 margin-right-10">Rejected Images:</p>
            <Badge bg="danger" text="light">
              {jobData ? rejectedInferences.length : "Loading..."}
            </Badge>
          </div>
          {approvedInferences.length > 0 && (
            <Button
              variant="primary"
              style={{ borderRadius: "0" }} // Set width to "auto" or a specific value like "200px"
              onClick={composeVideo}
              disabled={approvedInferences.length < 1}
            >
              Compose Final Video
            </Button>
          )}
        </Col>
      </Row>
      <hr />

      <Row>
        {inferences.map((inference, index) => (
          <Col key={index} xs={12} md={6} lg={3} className="mb-3">
            <Box
              style={{ backgroundColor: "black" }}
              title={
                <>
                  <h5>{inference.camera_name.toUpperCase()}</h5>
                  <Badge bg="secondary" className="mr-2">
                    Score:{" "}
                    {inference.score ? inference.score.toFixed(2) : "N/A"}
                  </Badge>
                  <Badge
                    bg={
                      inference.status === "approved"
                        ? "success"
                        : inference.status === "rejected"
                        ? "danger"
                        : inference.status === "pending"
                        ? "warning"
                        : "secondary"
                    }
                  >
                    {inference.status.toUpperCase()}
                  </Badge>
                </>
              }
              content={
                <div>
                  <video
                    id={`video-${inference.frame_number}`}
                    width="100%"
                    preload="none"
                    controls
                    poster={inference.orig_img}
                  >
                    {/* <source
                      src={`http://localhost:9000/api/stream/video/${inference.video
                        .split("/")
                        .pop()}/${inference.frame_number}`}
                      type="video/mp4"
                    /> */}
                    <source
                      src={`http://localhost:9000/api/stream/video/660a82b69e2fde77335089d0/${inference.frame_number}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  <ul className="mb-0 list-none">
                    <li>Loc:{inference.location}</li>
                    <li>Frame: {inference.frame_number}</li>
                  </ul>
                </div>
              }
              footer={
                <Button
                  block
                  variant="primary"
                  style={{ width: "100%", borderRadius: "0" }}
                  // size="sm"
                  onClick={() => handleShowModal(index)}
                >
                  Review
                </Button>
              }
            />
          </Col>
        ))}
      </Row>

      <Modal fullscreen show={showModal} onHide={handleCloseModal}>
        <Modal.Header className="modal-title-white" closeButton>
          <Modal.Title>
            Displaying Inference Details -{" "}
            {currentIndex !== null
              ? `${currentIndex + 1}/${inferences.length}`
              : "Loading..."}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={8} className="no-gap">
              <div className="modal-frame p-2">
                <div className="d-flex">
                  <h4>Identity Verification</h4>
                  <h6>Inference Job ID: {jobId}</h6>
                </div>

                {currentIndex !== null && (
                  <>
                    <Badge bg="secondary">
                      Score: {inferences[currentIndex].score.toFixed(2)}
                    </Badge>
                    <p>
                      Please review the image contents and approve or reject.
                    </p>
                    <MediaCarousel inference={inferences[currentIndex]} />
                    <div className="d-flex justify-content-start">
                      <Button
                        variant="success"
                        className="m-2"
                        size="sm"
                        onClick={() => handleDecision(currentIndex, "approve")}
                        disabled={
                          inferences[currentIndex].status === "approved"
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        className="m-2"
                        variant="outline-danger"
                        onClick={() => handleDecision(currentIndex, "reject")}
                        disabled={
                          inferences[currentIndex].status === "rejected"
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Col>

            <Col xs={4} className="no-gap">
              <div className="modal-frame p-2">
                <MapView markers={markers} mapCenter={mapCenter} zoom={13} />
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th colSpan="2">Camera Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Camera ID</td>
                      <td>
                        {currentIndex !== null &&
                          inferences[currentIndex].camera_name}
                      </td>
                    </tr>
                    <tr>
                      <td>Location</td>
                      <td>
                        {" "}
                        {currentIndex !== null &&
                          inferences[currentIndex].location}
                      </td>
                    </tr>
                    <tr>
                      <td>Latitude</td>
                      <td>
                        {" "}
                        {currentIndex !== null && inferences[currentIndex].lat}
                      </td>
                    </tr>
                    <tr>
                      <td>Longitude</td>
                      <td>
                        {" "}
                        {currentIndex !== null && inferences[currentIndex].lng}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <i>
                  <a href="/regions">Camera Map</a>
                </i>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button
            size="lg"
            variant="primary"
            onClick={handlePrevInference}
            style={{ marginRight: "5px" }}
          >
            Prev
          </Button>
          <Button variant="primary" size="lg" onClick={handleNextInference}>
            Next
          </Button>
          <p className="d-inline ml-2">
            {/* Click to navigate between inferences. */}
          </p>
          {/* <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button> */}
        </Modal.Footer>
      </Modal>

      <Modal show={showDetails} onHide={() => setShowDetails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ShowJobDetails />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default JobReview;
