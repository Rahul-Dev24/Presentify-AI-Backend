import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
    // 1. Try header first
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader) {
        token = authHeader.split(" ")[1];
    }

    // 2. If no header, try cookies
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }

    // 3. If still no token
    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};
