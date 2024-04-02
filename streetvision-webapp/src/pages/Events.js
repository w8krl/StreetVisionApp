import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from "../components";
import Button from "react-bootstrap/Button";
import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Card, CardDeck } from "react-bootstrap";

// import { useDispatch, useSelector } from "react-redux";
// // import { fetchEvents } from "../redux/features/events/eventThunks";

// // Define the structure of your data for the table
// const headers = [
//   { prop: "cam_name", title: "Name", isFilterable: true },
//   { prop: "location", title: "Address", isFilterable: true },
//   { prop: "lat", title: "Latitude" },
//   { prop: "lon", title: "Longitude" },
// ];

const Events = () => {
  // despatch reducer
  // const dispatch = useDispatch();
  // const eventsState = useSelector((state) => state.events.Events);

  // useEffect(() => {
  //   dispatch(fetchEvents());
  // }, [dispatch]);

  return (
    <Layout>
      <Container fluid>
        <h2>Active Event Processing Dashboard</h2>
        <Row className="pt-2">
          <Col>
            <Card className="text-center" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>In-flight Cases</Card.Title>
                <h1>12</h1>
                <p className="sm">Persons of interest</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-center" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>POI Matches</Card.Title>
                <h1>12</h1>
                <p className="sm">878 frames / 98 clips</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-center" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Video Processed</Card.Title>
                <h1>467/670 (hrs)</h1>
                <p className="sm">Rate 1.73 hrs/pm</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-center" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Identity Matches</Card.Title>
                <h1>8/12</h1>
                <p className="sm">4 pending</p>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="text-center" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>Identity Matches</Card.Title>
                <h1>8/12</h1>
                <p className="sm">4 pending</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="pt-4"></Row>
      </Container>
    </Layout>
  );
};

export default Events;
