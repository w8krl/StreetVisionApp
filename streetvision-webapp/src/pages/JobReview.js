import React, { useState, useEffect } from "react";
import { Layout } from "../components";
import { Button, Row, Col, Image, Badge, Modal } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import Box from "../components/Box";
import Alert from "react-bootstrap/Alert";
import { CiCircleInfo } from "react-icons/ci";
import MapView from "../components/MapView";
import { renderToStaticMarkup } from "react-dom/server";
import { GiCctvCamera } from "react-icons/gi";
import L from "leaflet";
import { useParams } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "../MediaCarousel.css";

const MediaCarousel = ({ inference }) => {
  const ref = React.useRef(null);

  const handlePrev = () => {
    ref.current.prev();
  };

  const handleNext = () => {
    ref.current.next();
  };

  return (
    <div className="carousel-wrapper">
      <Carousel ref={ref} interval={null} indicators={false} controls={false}>
        <Carousel.Item>
          <img
            src={inference.orig_img}
            alt="Original"
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <video
            id={`video-${inference.frame_number}`}
            width="100%"
            controls
            preload="none"
            poster={inference.orig_img}
          >
            <source
              src={`http://localhost:9000/api/stream/video/660a82b69e2fde77335089d0/${inference.frame_number}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </Carousel.Item>
      </Carousel>
      <Button
        className="carousel-control-prev"
        onClick={handlePrev}
        aria-label="Previous"
      >
        {"<"}
      </Button>
      <Button
        className="carousel-control-next"
        onClick={handleNext}
        aria-label="Next"
      >
        {">"}
      </Button>
    </div>
  );
};

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

        const markers = Array.from(uniqueCoords.values()).map((clip) => ({
          key: `${clip.lat},${clip.lng}`, // Use the coordinate pair as a unique key
          position: [clip.lat, clip.lng],
          icon: createCustomIcon(), // Assuming this function does not depend on clip-specific data
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
              {/* You might want to adjust what happens in setPrimary or its equivalent */}
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
      const sortedInferences = jobData.details.clip_results.sort(
        (a, b) => b.score - a.score
      );
      setInferences(sortedInferences);
    }
  }, [jobData]);

  const handleApproval = (index, approved) => {
    console.log(`Inference ${index} approved: ${approved}`);
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

  return (
    <Layout>
      <h2>Inference Verification </h2>

      <Alert
        className="bg-gov-blue"
        variant="info"
        onClose={() => setShow(false)}
        dismissible
      >
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
              title={
                <Badge bg="secondary">
                  Score: {inference.score.toFixed(2)}
                </Badge>
              }
              content={
                <div>
                  {/* <Image
                    src={inference.orig_img}
                    style={{
                      maxWidth: "100%",
                      height: "100%",
                      boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)",
                    }}
                  /> */}
                  <video
                    id={`video-${inference.frame_number}`} // Ensure each video has a unique ID
                    width="100%"
                    preload="none"
                    controls
                    poster={inference.orig_img}
                  >
                    <source
                      src={`http://localhost:9000/api/stream/video/660a82b69e2fde77335089d0/${inference.frame_number}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  {/* <Button
                    variant="primary"
                    size="sm"
                    onClick={(e) => {
                      const video = document.getElementById(
                        `video-${inference.frame_number}`
                      );
                      if (video.paused) {
                        video.play();
                      } else {
                        video.pause();
                      }
                    }}
                  >
                    Play/Pause
                  </Button> */}
                </div>
              }
              footer={
                <>
                  <div className="d-flex p-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowModal(index)}
                    >
                      Review
                    </Button>
                  </div>
                </>
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
                  <h4>Identity Verification</h4> <></>
                </div>
                {/* This column takes up 10/12 of the width, or roughly 80% */}

                {currentIndex !== null && (
                  <>
                    <Badge bg="secondary">
                      Score: {inferences[currentIndex].score.toFixed(2)}
                    </Badge>
                    <p>
                      Please review the image contents and approve or reject{" "}
                    </p>

                    {/* <Image src={inferences[currentIndex].orig_img} fluid /> */}
                    <MediaCarousel inference={inferences[currentIndex]} />

                    {/* Other details you want to show */}
                  </>
                )}
                <div className="d-flex justify-content-start">
                  <Button
                    variant="success"
                    className="m-2"
                    size="sm"
                    onClick={() => handleApproval(currentIndex, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    className="m-2"
                    variant="outline-danger"
                    onClick={() => handleApproval(currentIndex, false)}
                  >
                    Reject
                  </Button>
                </div>
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
            size="sm"
            variant="outline-primary"
            onClick={handlePrevInference}
            style={{ marginRight: "5px" }}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={handleNextInference}
          >
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
    </Layout>
  );
};

export default JobReview;
