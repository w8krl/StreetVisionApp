from kafka import KafkaConsumer, KafkaProducer, errors
import json
import time
from StreetVisionV5 import StreetVisionV5
from VideoComposer import VideoComposer

# Kafka settings
kafkaBrokers = 'localhost:9092'
videoProcessingTopic = 'video_processing_jobs'
videoProcessingStatusTopic = 'video_processing_status'
compositionJobTopic = 'composition_jobs'
compositionJobStatusTopic = 'composition_job_status'

def createProducer():
    try:
        return KafkaProducer(
            bootstrap_servers=[kafkaBrokers], 
            value_serializer=lambda m: json.dumps(m).encode('utf-8')
        )
    except errors.NoBrokersAvailable:
        raise Exception("Failed to connect to Kafka brokers.")

producer = createProducer()

def createConsumer(topics, group_id):
    try:
        return KafkaConsumer(
            *topics,
            bootstrap_servers=[kafkaBrokers],
            auto_offset_reset='earliest',
            value_deserializer=lambda m: json.loads(m.decode('utf-8')),
            group_id=group_id
        )
    except errors.NoBrokersAvailable:
        raise Exception(f"Failed to create Kafka consumer for topics: {topics}")

# Subscribe to both topics with one consumer
consumer = createConsumer([videoProcessingTopic, compositionJobTopic], "video-composition-group")

def sendStatusMessage(topic, jobId, status, details=None):
    message = {
        "jobId": jobId,
        "status": status,
        'details': details
    }
    producer.send(topic, value=message)
    producer.flush()

def processJob(message, jobType):
    print(f"Received {jobType} job with details:", message)
    jobId = message['jobId']
    
    if jobType == "video_analysis":
        # sv = StreetVisionV5(jobId=jobId, videoPaths=message['videos'], searchPrompt=message['poiDesc'], topN=message['topN'])
        # sv.start()
        # results = sv.resultsToDict()
        # sendStatusMessage(videoProcessingStatusTopic, jobId, "video_analysis_completed", results)
        jobId = message.get("jobId")
        searchPrompt = message.get("poiDesc")
        videoPaths = message.get("videos", [])
        topN = message.get("topN", 5)
        sv = StreetVisionV5(jobId=jobId, videoPaths=videoPaths, searchPrompt=searchPrompt, topN=topN)
        sv.start()
        results = sv.resultsToDict()
        print(f"Video analysis results for job ID: {jobId}", results)
        # sendStatusMessage(jobId, "video_analysis_completed", results)
        sendStatusMessage(videoProcessingStatusTopic, jobId, "video_analysis_completed", results)

    
    elif jobType == "composition_job":
        composer = VideoComposer(jobId, message['clips'])
        composer.composeVideo()
        results = composer.showResults()
        sendStatusMessage(compositionJobStatusTopic, jobId, "composition_completed", results)
        
    else:
        print(f"Unhandled job type: {jobType}")

def main():
    try:
        for message in consumer:
            if message.topic == videoProcessingTopic:
                processJob(message.value, "video_analysis")
            elif message.topic == compositionJobTopic:
                processJob(message.value, "composition_job")
    except KeyboardInterrupt:
        print("Stopped by user.")

if __name__ == "__main__":
    main()
