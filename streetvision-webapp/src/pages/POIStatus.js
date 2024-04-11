import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from "../components";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { GrView } from "react-icons/gr";
import { POIFormModal } from "../components";
import { JobModal } from "../components";
import { JobSelectModal } from "../components";
import { MdManageSearch } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Col, Row, Table, Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fetchPois } from "../redux/features/poi/poiThunks";

// // Update headers to match video data fields
const headers = [
  { prop: "createdAt", title: "Date Created", isFilterable: true },
  { prop: "caseNumber", title: "Case Number", isFilterable: true },
  { prop: "description", title: "Description", isFilterable: true },
  // { prop: "location", title: "Location", isFilterable: true },
  { prop: "severity", title: "Severity", isFilterable: true },
  { prop: "jobs", title: "Surveillance Jobs", isFilterable: true },
  { prop: "view", title: "Job Actions", isFilterable: true },
];

const POIStatus = () => {
  //   // Dispatch reducer
  const dispatch = useDispatch();
  const poiState = useSelector((state) => state.pois.Pois); // Updated for videos

  const [showPoiModal, setShowPoiModal] = React.useState(false);
  const [showJobModal, setShowJobModal] = React.useState(false);
  const [showJobSelectModal, setShowJobSelectModal] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  useEffect(() => {
    dispatch(fetchPois());
  }, [dispatch]);

  const handlePOIFormSuccess = () => {
    handleClosePoiModal();
    console.log("POI form submitted successfully");
    dispatch(fetchPois()); // load new pois
    toast.success("POI created successfully!"); //FIXME: Not dismissing
  };

  const handleJobFormSuccess = () => {
    handleCloseJobModal();
    console.log("Job form submitted successfully");
    dispatch(fetchPois()); // load new pois
    toast.success("Job created successfully!"); //FIXME: Not dismissing
  };

  const handleShowPoiModal = () => {
    // setCurrentIndex(index);
    setShowPoiModal(true);
  };
  const handleShowJobModal = (poiId) => {
    setCurrentIndex(poiId);
    setShowJobModal(true);
  };

  const handleCloseJobModal = () => {
    setShowJobModal(false);
  };
  const handleClosePoiModal = () => {
    setShowPoiModal(false);
  };

  const handleShowJobSelectModal = (poiId) => {
    setCurrentIndex(poiId);
    setShowJobSelectModal(true);
  };
  const handleCloseJobSelectModal = () => {
    setShowJobSelectModal(false);
  };

  // Map the data from mongo to UI format for videos
  const poisForTable = poiState.map((poi) => ({
    key: poi._id,
    createdAt: poi.createdAt,
    caseNumber: poi.caseNumber,
    description: poi.description,
    location: poi.location,
    severity: poi.severity,
    // createdAt: new Date(poi.createdAt).toLocaleString(),
    jobs: poi.jobs.length,
    running: poi.jobs.filter((job) => job.status === "video_analysis_pending")
      .length,
    updatedAt: new Date(poi.updatedAt).toLocaleString(),
  }));

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case "high":
        return "danger"; // Red
      case "medium":
        return "warning"; // Yellow
      case "low":
        return "success"; // Green
      default:
        return "secondary"; // Grey, for undefined or other severities
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <h1>Person of Interest Surveillance Jobs</h1>
      <p>
        View the status of all surveillance jobs for each Person of Interest.
        <br />
        Click here to create a new POI.
      </p>
      <Button size="sm" variant="primary" onClick={handleShowPoiModal}>
        Create POI
      </Button>
      <DatatableWrapper
        body={poisForTable}
        headers={headers}
        paginationOptionsProps={{
          initialState: {
            rowsPerPage: 20,
            options: [5, 10, 15, 20],
          },
        }}
      >
        <Row className="mb-4 p-2">
          <Col
            xs={12}
            lg={4}
            className="d-flex flex-col justify-content-end align-items-end"
          >
            <Filter placeholder="Type to search..." />
          </Col>
          <Col xs={12} sm={6} lg={4} className="d-flex justify-content-center">
            <PaginationOptions />
          </Col>
          <Col
            xs={12}
            sm={6}
            lg={4}
            className="d-flex flex-col justify-content-end align-items-end"
          >
            <Pagination />
          </Col>
        </Row>
        <Table striped bordered hover>
          <TableHeader />
          <TableBody>
            {poisForTable.map((poi) => (
              <tr key={poi.key}>
                <td>{new Date(poi.createdAt).toLocaleDateString()}</td>

                <td>{poi.caseNumber}</td>
                <td>
                  <i>"{poi.description}"</i>
                </td>
                {/* <td>{poi.location}</td> */}
                <td>
                  <Badge bg={getSeverityBadgeVariant(poi.severity)}>
                    {poi.severity}
                  </Badge>
                </td>
                <td>
                  <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={() => handleShowJobSelectModal(poi.key)}
                  >
                    {poi.jobs}
                  </span>
                  {poi.running > 0 && (
                    <Badge style={{ marginLeft: "8px" }} bg="primary">
                      {poi.running} in progress
                    </Badge>
                  )}
                </td>
                <td style={{ width: "8rem" }}>
                  {/* {poi.jobs > 0 && ( */}
                  <Button size="sm" onClick={() => handleShowJobModal(poi.key)}>
                    {" New Job"}
                    <MdManageSearch />
                  </Button>
                  {/* )} */}
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </DatatableWrapper>

      <Modal size="lg" show={showPoiModal} onHide={handleClosePoiModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Register Person Of Interest</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <POIFormModal onFormSuccess={handlePOIFormSuccess} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between"></Modal.Footer>
      </Modal>

      <Modal size="lg" show={showJobModal} onHide={handleCloseJobModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Run Surveillance on Person of Interest</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JobModal poiId={currentIndex} onFormSuccess={handleJobFormSuccess} />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between"></Modal.Footer>
      </Modal>

      <Modal
        size="lg"
        show={showJobSelectModal}
        onHide={handleCloseJobSelectModal}
        className="modal-job-details"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>View Job Status for POI</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <JobSelectModal
            poiId={currentIndex}
            onFormSuccess={handleJobFormSuccess}
          />
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between"></Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default POIStatus;
