
import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { updateUser, userData } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.put("/update", authMiddleware, updateUser);
userRouter.get("/getUser", authMiddleware, userData);

export default userRouter;