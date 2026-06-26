import express from 'express';
import { getHtmlResponse, getProjectByUserId } from "../controllers/ppt.controller.js";
import { getTranscript } from "../controllers/audio.controller.js";
import { authMiddleware } from '../middleware/auth.middleware.js';

const pptRoute = express.Router();

// pptRoute.post("/response", saveResponse)
pptRoute.post("/response", authMiddleware, getHtmlResponse);
pptRoute.post("/transcript", getTranscript);
pptRoute.get("/getProject", authMiddleware, getProjectByUserId)

export default pptRoute;