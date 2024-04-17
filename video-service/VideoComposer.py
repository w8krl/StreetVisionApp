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
        os.makedirs(self.jobDataPath, exist_ok=True)

    def verifyData(self):
        required_keys = {"frame_number", "status", "video", "camera_name", "location"}
        if not all(all(k in clip for k in required_keys) for clip in self.clipData):
            raise ValueError("Data is missing required fields")

    def frameToTime(self, frameNumber, fps=30):
        return frameNumber / fps

    def composeVideo(self):
        self.verifyData()
        
        video_groups = {}
        for clip in self.clipData:
            if clip['status'] == 'approved':
                video_path = clip['video']
                if video_path not in video_groups:
                    video_groups[video_path] = []
                startTime = max(0, self.frameToTime(clip['frame_number']) - 5)
                endTime = self.frameToTime(clip['frame_number']) + 5
                video_groups[video_path].append((startTime, endTime, clip['camera_name'], clip['location']))

        for video_path, clips in video_groups.items():
            clips.sort()
            merged_clips = []
            for start, end, cameraName, location in clips:
                if not merged_clips or start > merged_clips[-1][1]:
                    merged_clips.append([start, end, cameraName, location])
                else:
                    merged_clips[-1][1] = max(merged_clips[-1][1], end)

            for start, end, cameraName, location in merged_clips:
                clip = VideoFileClip(video_path).subclip(start, end)
                txtClip = TextClip(f"{cameraName} - {location}", fontsize=24, color='white', font="Arial-Bold")
                txtClip = txtClip.set_position('bottom').set_duration(clip.duration)
                video = CompositeVideoClip([clip, txtClip])
                self.videoClips.append(video)

        finalClip = concatenate_videoclips(self.videoClips, method="compose")
        finalClip.write_videofile(self.videoPath, codec="libx264", fps=24)

    def showResults(self):
        # JSON output for potential use in messaging or logging
        return {
            "video_path": self.videoPath,
            "number_of_clips": len(self.videoClips)
        }