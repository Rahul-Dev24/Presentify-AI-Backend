import express from 'express';
import path from 'path';
import fs from 'fs';
import { validateYouTubeUrl } from '../utils/validators.js';

const router = express.Router();


router.get('/video/youTube', (req, res) => {
    try {
        const { youtubeUrl } = req.body;

        // Validate input
        if (!youtubeUrl) {
            return res.status(400).json({ error: 'youtubeUrl and email are required' });
        }

        if (!validateYouTubeUrl(youtubeUrl)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Create job
        const job = createJob(youtubeUrl, email);

        res.json({
            jobId: job.jobId,
            status: job.status
        });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Failed to create job' });
    }
});


router.get('/video/local', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/ppt.pptx'))
})

export default router;