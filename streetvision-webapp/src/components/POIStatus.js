import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from ".";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { GrView } from "react-icons/gr";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Col, Row, Table } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fetchPois } from "../redux/features/poi/poiThunks";

// // Update headers to match video data fields
const headers = [
  { prop: "caseNumber", title: "Case Number", isFilterable: true },
  { prop: "description", title: "Description", isFilterable: true },
  { prop: "location", title: "Location", isFilterable: true },
  { prop: "severity", title: "Severity", isFilterable: true },
  { prop: "jobs", title: "Active Surveillance Jobs", isFilterable: true },
  { prop: "view", title: "Details", isFilterable: true },
];

const POIStatus = () => {
  //   // Dispatch reducer
  const dispatch = useDispatch();
  const poiState = useSelector((state) => state.pois.Pois); // Updated for videos

  useEffect(() => {
    dispatch(fetchPois());
  }, [dispatch]);

  // Map the data from mongo to UI format for videos
  const poisForTable = poiState.map((poi) => ({
    key: poi._id,
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

  console.dir(poiState);

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
      <h1>POI Surveillance Jobs</h1>
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
                <td>{poi.caseNumber}</td>
                <td>
                  <i>"{poi.description}"</i>
                </td>
                <td>{poi.location}</td>
                <td>
                  <Badge bg={getSeverityBadgeVariant(poi.severity)}>
                    {poi.severity}
                  </Badge>
                </td>
                <td>
                  {poi.jobs}
                  {poi.running > 0 && (
                    <Badge style={{ marginLeft: "8px" }} bg="primary">
                      {poi.running} in Progress
                    </Badge>
                  )}
                </td>
                <td>
                  {poi.jobs > 0 && (
                    <Button size="sm">
                      {" View "}
                      <GrView />{" "}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </DatatableWrapper>
    </Layout>
  );
};

export default POIStatus;
