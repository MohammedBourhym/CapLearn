import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { transcribeAudioWithGroq } from '../utils/groqClient.js';

// POST /api/subtitles/upload

// Helper to convert video to mp3 and return mp3 path
const uploadAndConvertToMp3 = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath = inputPath + '.mp3';
    exec(`ffmpeg -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}"`, (err) => {
      if (err) {
        reject('Failed to convert video to mp3');
      } else {
        resolve(outputPath);
      }
    });
  });
};

const extractSubtitles = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const inputPath = req.file.path;
    // 1. Convert to mp3
    let mp3Path;
    try {
      mp3Path = await uploadAndConvertToMp3(inputPath);
    } catch (err) {
      fs.unlink(inputPath, () => {});
      return res.status(500).json({ error: err });
    }
    // 2. Transcribe with Groq
    let transcription;
    try {
      transcription = await transcribeAudioWithGroq(mp3Path);
    } catch (err) {
      fs.unlink(inputPath, () => {});
      fs.unlink(mp3Path, () => {});
      return res.status(500).json({ error: 'Transcription failed', details: err });
    }
    // 3. Clean up files
    fs.unlink(inputPath, () => {});
    fs.unlink(mp3Path, () => {});
    // 4. Return transcription
    res.json({ transcription });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export { uploadAndConvertToMp3, extractSubtitles };


