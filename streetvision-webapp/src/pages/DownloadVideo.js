import React from "react";
import { Layout } from "../components";

const DownloadVideo = () => {

    useEffect(() => {
        const fetchJobData = async () => {
          try {
            // const jobId = "6618022d7448db43fbf703a7";
            const response = await fetch(
              `http://localhost:9000/api/jobs/id/${jobId}`
            );
            const data = await response.json();
            setJobData(data);
        } catch (error) {
            console.error("Error fetching job data:", error);
        }
    }
    fetchJobData();
    }
    }, []);
    

  return (
    <div>
      <h1>Download Video for job ID</h1>
      <p>This is the download video page</p>
    </div>
  );
};

export default DownloadVideo;
