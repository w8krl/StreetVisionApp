import React, { useState, useEffect } from "react";
import "../MediaCarousel.css";
import { Carousel } from "react-bootstrap";
import { Button } from "react-bootstrap";

// Update inference object to match video data fields
// used in jobReview.js and others
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

export default MediaCarousel;
