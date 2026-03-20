import express from "express";
import { youtubeVideoUpload, getAllVideo, updateVideo, storeLocalVideo, deleteVideo, processTranscriptByPython, getVideoByUserId, getSlidesByFileId } from "../controllers/video.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const videoRouter = express.Router();


videoRouter.get("/getVideos", authMiddleware, getAllVideo);
videoRouter.post("/youTube", authMiddleware, youtubeVideoUpload);
videoRouter.post("/local", authMiddleware, storeLocalVideo);
videoRouter.put("/update/:id", authMiddleware, updateVideo);
videoRouter.delete("/delete", authMiddleware, deleteVideo);
videoRouter.post("/processTranscript", processTranscriptByPython);
videoRouter.get("/userFiles", authMiddleware, getVideoByUserId);
videoRouter.post("/getSlidesByFileId", authMiddleware, getSlidesByFileId)

export default videoRouter;