import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Layout } from ".";

// icons
import { TbProgress } from "react-icons/tb";
import { CiCircleCheck } from "react-icons/ci";

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

// Update headers to match video data fields
const headers = [
  { prop: "camera_name", title: "Camera Name", isFilterable: true },
  { prop: "start_time", title: "Start Time", isFilterable: true },
  { prop: "end_time", title: "End Time", isFilterable: true },
  { prop: "duration", title: "Duration (minutes)" },
  { prop: "frame_rate", title: "Frame Rate" },
  { prop: "processed", title: "Processed" },
];

const POIStatus = () => {
  // Dispatch reducer
  const dispatch = useDispatch();
  const poiState = useSelector((state) => state.pois.pois); // Updated for videos

  useEffect(() => {
    dispatch(fetchPois());
  }, [dispatch]);

  // Map the data from mongo to UI format for videos
  const videosForTable = poiState.map((video) => ({
    camera_name: video.camera_name,
    start_time: video.start_time,
    end_time: video.end_time,
    duration: video.duration,
    frame_rate: video.frame_rate,
    processed: video.processed ? "Yes" : "No",
  }));

  return (
    <Layout>
      <h1>Video Decoding</h1>
      <DatatableWrapper
        body={videosForTable}
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
            {videosForTable.map((video) => (
              <tr key={video.camera_name}>
                <td>{video.camera_name}</td>
                <td>{video.start_time}</td>
                <td>{video.end_time}</td>
                <td>{video.duration}</td>
                <td>{video.frame_rate}</td>
                <td>
                  {!video.processed ? (
                    <TbProgress color="red" />
                  ) : (
                    <CiCircleCheck color="green" />
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
