import express from "express";
import { youtubeVideoUpload, getAllVideo, updateVideo, storeLocalVideo, deleteVideo } from "../controllers/video.controller.js";

const videoRouter = express.Router();


videoRouter.get("/getVideos", getAllVideo);
videoRouter.post("/youTube", youtubeVideoUpload);
videoRouter.post("/local", storeLocalVideo);
videoRouter.put("/update/:id", updateVideo);
videoRouter.delete("/delete/:id", deleteVideo)

export default videoRouter;