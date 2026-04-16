import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getProjects, deleteProject } from "../controllers/project.controller.js";

const pRouter = express.Router();

pRouter.get("/getProject", authMiddleware, getProjects);
pRouter.delete("/deleteProject", authMiddleware, deleteProject);

export default pRouter;