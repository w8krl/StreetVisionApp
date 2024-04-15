import os
import json
from moviepy.editor import VideoFileClip, concatenate_videoclips, TextClip, CompositeVideoClip

class VideoComposer:
    def __init__(self, jobId, clipData):
        self.jobId = jobId
        self.clipData = clipData
        self.jobDataPath = f'./media-store/job-data/{jobId}/composition/'
        self.videoPath = self.jobDataPath + 'final_output.mp4'
        self.videoClips = []
        self.mergedClips = []

        os.makedirs(self.jobDataPath, exist_ok=True)

    def verifyData(self):
        # CHeck datastructure
        if not all(k in clip for clip in self.clipData for k in ("frame_number", "status", "video", "camera_name", "location")):
            raise ValueError("Data is missing required fields")

    def frameToTime(self, frameNumber, fps=30):
        return frameNumber / fps

    def composeVideo(self):
        self.verifyData()
        
        clips = []
        for clip in self.clipData:
            if clip['status'] == 'approved':
                startTime = max(0, self.frameToTime(clip['frame_number']) - 5)
                endTime = self.frameToTime(clip['frame_number']) + 5
                clips.append((startTime, endTime, clip['video'], clip['camera_name'], clip['location']))

        clips.sort()
        for start, end, video, cameraName, location in clips:
            if not self.mergedClips or start > self.mergedClips[-1][1]:
                self.mergedClips.append([start, end, video, cameraName, location])
            else:
                self.mergedClips[-1][1] = max(self.mergedClips[-1][1], end)

        for start, end, videoPath, cameraName, location in self.mergedClips:
            clip = VideoFileClip(videoPath).subclip(start, end)
            txtClip = TextClip(f"{cameraName} - {location}", fontsize=24, color='white', font="Arial-Bold")
            txtClip = txtClip.set_position('bottom').set_duration(clip.duration)
            video = CompositeVideoClip([clip, txtClip])
            self.videoClips.append(video)

        finalClip = concatenate_videoclips(self.videoClips)
        finalClip.write_videofile(self.videoPath, codec="libx264", fps=24)

    def showResults(self):
        # Returning JSON  for KAFKA
        mergedClipsDetails = [
            {
                "start_time": clip[0],
                "end_time": clip[1],
                "video_path": clip[2],
                "camera_name": clip[3],
                "location": clip[4]
            } for clip in self.mergedClips
        ]
        return {
            "video_path": self.videoPath,
            "number_of_clips": len(self.videoClips),
            "merged_clips": mergedClipsDetails
        }
