import express from 'express';
import multer from 'multer';
import path from 'path';
import { processVideoForTranscription } from '../controllers/subtitles.controller.js';
import { processYoutubeUrl } from '../controllers/subtitles.controller.js';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to handle video upload and transcription
router.post('/upload', upload.single('video'), processVideoForTranscription);

// Route to handle YouTube URL processing
router.post('/youtube', express.json(), processYoutubeUrl);

export default router;