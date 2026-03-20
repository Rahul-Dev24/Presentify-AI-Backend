import express from 'express';
import path from 'path';
// import { genrateSlides } from '../controllers/gemini.controller.js'
import { getHtmlResponse } from '../controllers/ppt.controller.js'

const router = express.Router();


router.get('/video/youTube', async (req, res) => {

});

// router.post('/getSlides', async (req, res) => {
//     const { slideArray } = req.body;
//     if (!slideArray) {
//         return res.status(400).json({ success: false, message: "Requeried fields are missing." });
//     }
//     const data = await genrateSlides(slideArray);
//     res.status(200).json({ success: true, message: "Video uploaded successfully", data: data });
// });

router.post('/getSlides', getHtmlResponse);


router.get('/video/local', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/ppt.pptx'))
})

export default router;