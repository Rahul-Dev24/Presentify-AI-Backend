import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/getPPT.route.js';
// import { startWorker, startCleanup } from './services/worker.js';
import authRouter from './routes/auth.routes.js';
import videoRouter from './routes/video.route.js';
import pptRoute from './routes/ppt.route.js';
import { prisma } from './utils/prisma.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from "path";
import dRouter from './routes/dashboard..route.js';
import pRouter from './routes/project.route.js';
import userRouter from './routes/users.routes.js';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware

app.use(cookieParser());

app.use(cors({
    origin: ["https://0rlvc7lt-3000.inc1.devtunnels.ms", "http://localhost:3000"],
    credentials: true                // Required for withCredentials: true
}));
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

const baseUrl = "/api/v1"

app.use(`/uploads`, express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/video`, videoRouter);
app.use(`${baseUrl}/ppt`, pptRoute);
app.use(`${baseUrl}/dashboard`, dRouter);
app.use(`${baseUrl}/project`, pRouter);
app.use(`${baseUrl}/user`, userRouter);
app.use(baseUrl, router);

// Health check
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);

    // Start background worker
    // startWorker();

    // Start cleanup job
    // startCleanup();
});

export default app;
