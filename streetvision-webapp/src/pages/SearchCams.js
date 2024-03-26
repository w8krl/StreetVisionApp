import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from "../components";
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
import { fetchCameras } from "../redux/features/cameras/cameraThunks";

// Define the structure of your data for the table
const headers = [
  { prop: "cam_name", title: "Name", isFilterable: true },
  { prop: "location", title: "Address", isFilterable: true },
  { prop: "lat", title: "Latitude" },
  { prop: "lon", title: "Longitude" },
];

const SearchCams = () => {
  // despatch reducer
  const dispatch = useDispatch();
  const camerasState = useSelector((state) => state.cameras.Cameras);

  useEffect(() => {
    dispatch(fetchCameras());
  }, [dispatch]);

  // Map the data from mongo to UI format
  const camerasForTable = camerasState.map((cam) => ({
    cam_name: cam.cam_name,
    location: cam.location,
    lat: cam.geometry.coordinates[0].toString(),
    lon: cam.geometry.coordinates[1].toString(),
  }));

  return (
    <Layout>
      <h1>Search Cameras</h1>
      <DatatableWrapper
        body={camerasForTable}
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
          <TableBody />
        </Table>
      </DatatableWrapper>
    </Layout>
  );
};

export default SearchCams;
