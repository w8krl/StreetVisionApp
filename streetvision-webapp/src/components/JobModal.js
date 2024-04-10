import React, { useState, useEffect } from "react";
import { CamMap, Layout } from "../components";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CiCircleInfo } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import CamMap from "../components";

import { useDispatch, useSelector } from "react-redux";
import { fetchCameras } from "../redux/features/cameras/cameraThunks";

const JobModal = () => {
  // get cams into rexud
  // despatch reducer
  const dispatch = useDispatch();
  const camerasState = useSelector((state) => state.cameras.Cameras);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    dispatch(fetchCameras());
  }, [dispatch]);

  const [formData, setFormData] = useState({
    fromDate: "",
    toDate: "",
    location: "",
    description: "",
    caseNumber: "",
    severity: "",
  });

  const handleLocationSelect = (latlng) => {
    setClickedLocation(latlng);
    console.log("Location selected", latlng);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const todayDate = new Date().toISOString().slice(0, 16);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update formData state
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { fromDate, toDate, location, description, caseNumber, severity } =
      formData;
    let isValid = true;
    let errorMessage = "";

    if (
      !fromDate ||
      !toDate ||
      !location ||
      !description ||
      !caseNumber ||
      !severity
    ) {
      errorMessage = "All fields are required.";
      isValid = false;
    } else if (description.length < 10) {
      errorMessage = "Description is too short.";
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

    try {
      const response = await fetch("http://localhost:9000/api/createPoi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await response.json();
      setIsSubmitted(true);
      toast.success("POI created successfully!");
    } catch (error) {
      toast.error("Error submitting form");
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

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group as={Row} className="mb-3">
          <Col md={6}>
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
          </Col>
          <Col md={6}>
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
          </Col>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>POI Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            placeholder="Describe the person of interest using free text i.e. male with black shoes and red shirt holding a bag."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" as={Row}>
          <Col md={6}>
            <Form.Label>Case Number</Form.Label>
            <Form.Control
              type="text"
              name="caseNumber"
              placeholder="Enter case number"
              value={formData.caseNumber}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={6}>
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
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Col md={4}>
            <Form.Label>Search for Coverage</Form.Label>
            <Form.Control
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <Form.Label>Search for camera</Form.Label>

            <Form.Select
              name="cameras"
              value={formData.cameras}
              onChange={handleCameraSelect}
              multiple
              required
            >
              {camerasState.map((camera) => (
                <option key={camera._id} value={camera._id}>
                  {camera.location}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* <Form.Label>Primary Camera</Form.Label> */}
          <Col md={8}>
            <CamMap onLocationSelect={handleLocationSelect} />
          </Col>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={isSubmitted}>
          {isSubmitted ? "POI Created" : "Submit"}
        </Button>
      </Form>
    </>
  );
};

export default JobModal;
