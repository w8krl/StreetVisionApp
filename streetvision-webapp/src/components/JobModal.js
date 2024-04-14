import React, { useState, useEffect } from "react";
import { CamMap, Layout } from "../components";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { CiCircleInfo } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import CamMap from "../components";

import { useDispatch, useSelector } from "react-redux";
import { fetchCameras } from "../redux/features/cameras/cameraThunks";

const JobModal = ({ poiId, onFormSuccess }) => {
  // get cams into rexud
  // despatch reducer

  console.log(poiId);
  const dispatch = useDispatch();
  const camerasState = useSelector((state) => state.cameras.Cameras);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    dispatch(fetchCameras());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    poiId: poiId,
    latitude: "",
    longitude: "",
    radius: 10,
    fromDate: "",
    toDate: "",
  });

  const handleLocationSelect = (latlng) => {
    setFormData((prevState) => ({
      ...prevState,
      latitude: latlng.lat.toFixed(6), // Ensure consistent format
      longitude: latlng.lng.toFixed(6),
    }));
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const todayDate = new Date().toISOString().slice(0, 16);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "radius" ? parseFloat(value) : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const validateForm = () => {
    const { fromDate, toDate, latitude, longitude, severity, radius } =
      formData;
    let isValid = true;
    let errorMessage = "";

    if (
      !fromDate ||
      !toDate ||
      !latitude ||
      !longitude ||
      !severity ||
      !radius
    ) {
      errorMessage = "All fields are required.";
      isValid = false;
    } else if (
      new Date(fromDate).getTime() > new Date().getTime() ||
      new Date(toDate).getTime() > new Date().getTime()
    ) {
      errorMessage = "Dates cannot be in the future.";
      isValid = false;
    } else if (new Date(fromDate).getTime() > new Date(toDate).getTime()) {
      errorMessage = "From Date cannot be later than To Date.";
      isValid = false;
    }

    if (!isValid) {
      toast.error(errorMessage);
    }
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Prepare payload according to requirements
    const payload = {
      poiId: formData.poiId,
      location: "",
      coordinates: [
        parseFloat(formData.longitude),
        parseFloat(formData.latitude),
      ],
      radius: formData.radius,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    };

    try {
      const response = await fetch("http://localhost:9000/api/createSurvJob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || `Error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      await response.json();
      setIsSubmitted(true);
      if (onFormSuccess) onFormSuccess();
      // toast.success("Submission successful!");
    } catch (error) {
      toast.error("Error creating job: " + error.message);
    }
  };

  const dateValidation = (date) => {
    return date && new Date(date).getTime() <= new Date().getTime();
  };

  const handleCameraSelect = (e) => {
    const selectedCameras = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    // Update formData state
    setFormData((prevState) => ({
      ...prevState,
      cameras: selectedCameras,
    }));
  };

  return (
    <>
      <ToastContainer />
      <Alert size="sm" variant="info" dismissible>
        <CiCircleInfo />
        Interact by clicking on the map to set the lat/lon, or set it manually.
      </Alert>
      <Row>
        <Col md={4}>
          <h6>Set time period:</h6>
          <Form.Group as={Row} className="mb-3">
            <Form.Label>From Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              isInvalid={
                formData.fromDate && !dateValidation(formData.fromDate)
              }
              isValid={formData.fromDate && dateValidation(formData.fromDate)}
              disabled={isSubmitted}
              max={todayDate}
            />
            <Form.Control.Feedback type="invalid">
              Must be a past date and before To Date.
            </Form.Control.Feedback>
            <Form.Label>To Date</Form.Label>
            <Form.Control
              type="datetime-local"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              isInvalid={formData.toDate && !dateValidation(formData.toDate)}
              isValid={
                formData.toDate &&
                dateValidation(formData.toDate) &&
                new Date(formData.fromDate) <= new Date(formData.toDate)
              }
              disabled={isSubmitted}
              max={todayDate}
            />
            <Form.Control.Feedback type="invalid">
              Must be a past date and after From Date.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" as={Row}>
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              isValid={formData.severity}
              required
            >
              <option value="">Select severity level</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Form.Select>
          </Form.Group>
          <h6>Set Search Area:</h6>

          <Form.Label>Latitude</Form.Label>
          <Form.Control
            type="text"
            name="latitude"
            placeholder="Enter latitude"
            value={formData.latitude}
            onChange={handleChange}
            required
          />
          <Form.Label>Longitude</Form.Label>
          <Form.Control
            type="text"
            name="longitude"
            placeholder="Enter longitude"
            value={formData.longitude}
            onChange={handleChange}
            required
          />

          <Form.Label>Radius (meters)</Form.Label>
          <Form.Control
            type="number"
            name="radius" // Ensure this matches the key in your formData state
            placeholder="Enter search radius in meters"
            value={formData.radius}
            onChange={handleChange}
            required
          />
        </Col>
        <Col md={8}>
          <CamMap onLocationSelect={handleLocationSelect} />
        </Col>

        <Form onSubmit={handleSubmit} noValidate>
          <Button variant="primary" type="submit" disabled={isSubmitted}>
            {isSubmitted ? "Job Created" : "Run Search"}
          </Button>
        </Form>
      </Row>
    </>
  );
};

export default JobModal;
