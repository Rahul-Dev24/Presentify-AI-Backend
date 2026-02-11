import express from 'express';
import path from 'path';

const router = express.Router();


router.get('/video/youTube', async (req, res) => {

});


router.get('/video/local', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/ppt.pptx'))
})

export default router;