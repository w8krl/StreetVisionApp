from kafka import KafkaConsumer, KafkaProducer, errors
from kafka.errors import NoBrokersAvailable

import json
import time
from StreetVisionV5 import StreetVisionV5  

KAFKA_TOPIC = 'video_processing_jobs'
KAFKA_STATUS_TOPIC = 'video_processing_status'
KAFKA_BROKERS = 'kafka:29092'

def create_producer(attempts=5, wait=5):
    while attempts > 0:
        try:
            return KafkaProducer(bootstrap_servers=[KAFKA_BROKERS], value_serializer=lambda m: json.dumps(m).encode('utf-8'))
        except errors.NoBrokersAvailable:
            time.sleep(wait)
            attempts -= 1
    raise

producer = create_producer()


def create_consumer(attempts=5, wait=5):
    while attempts > 0:
        try:
            return KafkaConsumer(
                KAFKA_TOPIC,
                bootstrap_servers=[KAFKA_BROKERS],
                auto_offset_reset='earliest',
                value_deserializer=lambda m: json.loads(m.decode('utf-8')),
                group_id="video-processing-group"
            )
        except NoBrokersAvailable:
            time.sleep(wait)
            attempts -= 1
    raise Exception("Failed to create Kafka consumer after several attempts.")


consumer = create_consumer()


def sendStatusMessage(jobId, status, details=None):
    producer.send(KAFKA_STATUS_TOPIC, {"jobId": jobId, "status": status, 'details': details})
    producer.flush()

def process_job(message):
    print("Received job with details:", message)
    jobType = message.get("jobType")
    if jobType == "video_analysis":
        jobId = message.get("jobId")
        searchPrompt = message.get("poiDesc")
        videoPaths = message.get("videos", [])
        topN = message.get("topN", 5)
        sv = StreetVisionV5(jobId=jobId, videoPaths=videoPaths, searchPrompt=searchPrompt, topN=topN)
        sv.start()
        results = sv.resultsToDict()
        print(f"Video analysis results for job ID: {jobId}", results)
        sendStatusMessage(jobId, "video_analysis_completed", results)
    else:
        print(f"Unhandled job type: {jobType}")

def main():
    for message in consumer:
        process_job(message.value)
        time.sleep(5)

if __name__ == "__main__":
    main()
