import express from 'express';
import { getHtmlResponse } from "../controllers/ppt.controller.js";

const pptRoute = express.Router();

// pptRoute.post("/response", saveResponse)
pptRoute.post("/response", getHtmlResponse)

export default pptRoute;