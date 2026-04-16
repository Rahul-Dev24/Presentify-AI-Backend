import express from 'express';

import { getFileSourceStatsByUser, getCreditCount } from '../controllers/Dashboard.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const dRouter = express.Router();

dRouter.get("/getFileType", authMiddleware, getFileSourceStatsByUser);
dRouter.get("/getCreditCount", authMiddleware, getCreditCount);

export default dRouter;