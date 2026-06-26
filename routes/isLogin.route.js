import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { getMe, logout } from '../controllers/isLogin.controller.js';
const isLoginRouter = express.Router();


isLoginRouter.get("/me", authMiddleware, getMe);
isLoginRouter.post("/logout", logout);

export default isLoginRouter;