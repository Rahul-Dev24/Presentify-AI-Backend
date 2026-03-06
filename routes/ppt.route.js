import express from 'express';
import { getHtmlResponse } from "../controllers/ppt.controller.js";
import { getTranscript } from "../controllers/audio.controller.js";

const pptRoute = express.Router();

// pptRoute.post("/response", saveResponse)
pptRoute.post("/response", getHtmlResponse);
pptRoute.post("/transcript", getTranscript);

export default pptRoute;