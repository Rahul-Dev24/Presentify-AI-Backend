import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import router from './routes/getPPT.route.js';
// import { startWorker, startCleanup } from './services/worker.js';
import authRouter from './routes/auth.routes.js';
import { prisma } from './utils/prisma.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware

app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000", // Must be specific, cannot be "*"
    credentials: true                // Required for withCredentials: true
}));
app.use(express.static(join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

const baseUrl = "/api/v1"


// Routes
app.use(`${baseUrl}/auth`, authRouter);
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
