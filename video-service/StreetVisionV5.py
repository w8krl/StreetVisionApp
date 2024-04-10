import cv2
import torch
import numpy as np
import os
from transformers import CLIPTokenizerFast, CLIPProcessor, CLIPModel
from ultralytics import YOLO
from tqdm.auto import tqdm
from PIL import Image
import json
import datetime


"""
Main program to run YOLO and CLIP on video frames to detect persons and match descriptions
CUR LIMiTATIONS: runs clip on basis single person in frame (i.e. search for group of people will not work)
OUTPUTS: top n cropped images based on prompt with score, data stored in job folder
"""
class StreetVisionV5:
    def __init__(self, yoloWeights='yolov8n.pt', clipWeights='openai/clip-vit-base-patch32', jobId=None, videoPaths=[], searchPrompt=None, topN=5, clipBatchSize=32, interval=30):

        # Device setup - cuda, mps or cpu
        self.device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        print(f"Running on device: {self.device}")
        # CLIP and YOLO setup
        # os.environ["TOKENIZERS_PARALLELISM"] = "true"
        self.clipWeights = clipWeights
        self.model = CLIPModel.from_pretrained(clipWeights)
        self.processor = CLIPProcessor.from_pretrained(clipWeights)
        self.tokenizer = CLIPTokenizerFast.from_pretrained(clipWeights)
        self.model.to(self.device)
        self.model.eval()
        self.yolo = yoloWeights
        self.yoloModel = YOLO(yoloWeights)
        self.batchSize = clipBatchSize
        
        self.JOB_DATA_PATH = './media-store/job-data'

        self.videoPaths = videoPaths


        self.MAX_SEARCH_PROMPT_LEN = 80 #clip model limit

        # Media validation (input paths, interval etc.)
        self.validatedMedia = False
        self.interval = 30

        self.jobId = jobId
        self.searchPrompt = searchPrompt
        self.topN = topN
        self.jobFolder = None

        # Counters
        self.totalFramesProcessed = 0
        self.totalPersonsDetected = 0
        self.vidStats = []
        self.clipResults = []

        # Frame data
        self.personCrops = []
        self.frames = []
        self.frameLabels = []
        self.frameNumbers = []
        self.detections = 0
        self.bboxes = []

        # status stuff
        self.jobStatus = None

        self.start_time = datetime.datetime.now().isoformat()
        self.end_time = None
        

    def setJobId(self, jobId):
        self.jobId = jobId
        return
    
    def setClipBatchSize(self, batchSize):
        self.batchSize = batchSize
        return
    
    def setVideoPaths(self, videoPaths):
        self.videoPaths = videoPaths
        return
    
    def setSearchPrompt(self, searchPrompt):
        
        if (len(searchPrompt) > self.MAX_SEARCH_PROMPT_LEN):
            raise ValueError("Search prompt exceeds 80 characters")
        self.searchPrompt = searchPrompt
        
        return
    
    def resultsToDict(self):
        """
        Returns results as a dictionary"""
        return {
            "total_frames_processed": self.totalFramesProcessed,
            "total_persons_detected": self.totalPersonsDetected,
            "status": self.jobStatus,
            "job_id": self.jobId,
            "video_stats": self.vidStats,
            "clip_results": self.clipResults,
            "start_time": self.start_time,
            "end_time": self.end_time
        }


    def preValidation(self):
        
        print("Starting pre-validation checks")
        if not self.jobId:
            raise ValueError("Job ID not set")
        if not self.videoPaths:
            raise ValueError("Video paths not set")
        if not self.searchPrompt:
            raise ValueError("Search prompt not set")
        
        
        print("Pre-validation checks passed")
        return

    def start(self):
        # Run pre-validation checks before starting the job
        self.preValidation()  
        self.createJobFolder()

        # start job
        self.processVideos()
        self.end_time = datetime.datetime.now().isoformat()


    
    def validateMedia(self):
        # Pre validation checks
        valid = True

        errors = []
        for video in self.videoPaths:
            if not os.path.exists(video):
                valid = False
                errors.append(f"File {video} does not exist")
            if not video.endswith(".mp4"):
                valid = False
                errors.append(f"File {video} is not an mp4 file")
        if errors:
            print(f"Validation errors: ${len(errors)}")
            for error in errors:
                print(error)

        return valid

    def createJobFolder(self):
        self.jobFolder = os.path.join(self.JOB_DATA_PATH, str(self.jobId))
        os.makedirs(self.jobFolder, exist_ok=True)
        return
    

    def processVideos(self):
        """
        Main method to iterate videos, call yolo and clip and save results
        outputs: saves cropped images, vid trim, bbox results in job folder
        """
        self.jobStatus = "Started"
        
        for video in self.videoPaths:
            startPos = len(self.personCrops) # previous frames position

            self.yoloExtractPersons(video) # run yolo
            newPos = len(self.personCrops) - startPos # post yolo frames position (i.e. new data for this vid)


            # If new detections are present in next vid run CLIP
            if newPos > 0:
                print("Running CLIP on detected persons")

                # get img embeddings
                imgEmbeddings = self.getImgEmbeddings(self.personCrops[-startPos:])
                inputs = self.tokenizer(self.searchPrompt, return_tensors="pt").to(self.device)

                textEmb = self.model.get_text_features(**inputs).cpu().detach().numpy()
                imgEmbeddings = imgEmbeddings.T / np.linalg.norm(imgEmbeddings, axis=1)
                scores = np.dot(textEmb, imgEmbeddings)[0]

                print(f"Saving {self.topN} inference results for video {video}")
                topIndices = np.argsort(-scores)[:self.topN]

                vid = cv2.VideoCapture(video) # open video to get frames of top N, major refactor required.

                for i, idx in enumerate(topIndices):
                    # Save cropped images
                    framePath = os.path.join(self.jobFolder, f"frame_{self.frameNumbers[idx]}_{self.frameLabels[idx]}.png")
                    self.personCrops[idx].save(framePath)

                    # Reopen Draw bounding boxes on originals (top 30 only)
                    vid.set(cv2.CAP_PROP_POS_FRAMES, self.frameNumbers[idx])
                    _, frame = vid.read()
                    bbox = self.bboxes[idx] 
                    cv2.rectangle(frame, (int(bbox[0]), int(bbox[1])), (int(bbox[2]), int(bbox[3])), (0, 255, 0), 2)
                    framePathWithBbox = os.path.join(self.jobFolder, f"frame_{self.frameNumbers[idx]}_{self.frameLabels[idx]}_orig_bbox.png")
                    cv2.imwrite(framePathWithBbox,frame)

                    # Update results
                    self.clipResults.append({
                        "inference": framePath,
                        "orig_img": framePathWithBbox,
                        "score": float(scores[idx]),
                        "frame_number": self.frameNumbers[idx],
                        "video": video
                    })

                vid.release()

                
                    
            else:
                print(f"No persons detected in {video}")
                self.clipResults.append({
                    "inference": None,
                    "score": None,
                    "frame_number": None,
                    "video": video
                })

        self.jobStatus = "Finished"

        return
    
    def getImgEmbeddings(self, imgs):
        
        imgArr = None
        
        for i in tqdm(range(0, len(imgs), self.batchSize), desc="Processing images"):
            batch = imgs[i:i+self.batchSize]
            batch = self.processor(images=batch, return_tensors='pt')['pixel_values'].to(self.device)
            batchEmb = self.model.get_image_features(pixel_values=batch).cpu().detach().numpy()
            if imgArr is None:
                imgArr = batchEmb
            else:
                imgArr = np.concatenate((imgArr, batchEmb), axis=0)
        return imgArr    
    

    def yoloExtractPersons(self, videoPath):

        # runs yolo on video and extracts frames with persons (cropped, this worked better than whole frame)
        cap = cv2.VideoCapture(videoPath)

        fc = 0 
        framesProcessedPerVid = 0
        detetectionsPerVid = 0

        # OPen vid
        while cap.isOpened():
            success, frame = cap.read()
            if not success:
                break

            fc += 1

            if fc % self.interval == 0:
                framesProcessedPerVid += 1
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                # Run yolo (classes 0 for peeople only)
                results = self.yoloModel(frame, classes=0, device=self.device)
                boxes = results[0].boxes.xyxy.tolist()
                
                # boxes captures the coords of eacg person detected
                if boxes:
                    detetectionsPerVid += len(boxes)
                    for i, box in enumerate(boxes):
                        box = [int(j) for j in box]
                        x1, y1, x2, y2 = box
                        img = frame[y1:y2, x1:x2]
                        croppedImg = Image.fromarray(img)
                        self.bboxes.append(box)
                        self.personCrops.append(croppedImg) #change to crops, also need to add orig_img to show crop.
                        self.frameLabels.append(f"person_{i}")
                        self.frameNumbers.append(fc)

        # Update global counters
        self.totalFramesProcessed += framesProcessedPerVid
        self.totalPersonsDetected += detetectionsPerVid

        # Log per video stats
        self.vidStats.append({
            "video": videoPath,
            "frames_processed": framesProcessedPerVid,
            "person_detections": detetectionsPerVid
        })

        cap.release()
        return


# if __name__ == "__main__":

#     # DEBUGGING
#     vidPaths = ['/Users/m/Desktop/SurveillanceProject/peoplewalking.mp4', '/Users/m/Desktop/SurveillanceProject/peoplewalking2.mp4']
#     searchPrompt = "man wearing high vis vest"
#     jobId = 1
#     sv = StreetVisionV5(jobId=jobId, videoPaths=vidPaths, searchPrompt=searchPrompt)
#     sv.start()
#     print(sv.resultsToJson())
    