import { exec } from 'child_process';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { transcribeAudioWithGroq } from '../utils/groqClient.js';

const execPromise = util.promisify(exec);

// Convert video to MP3 using ffmpeg
const convertVideoToMp3 = async (inputPath) => {
  const outputPath = `${inputPath}.mp3`;
  try {
    await execPromise(`ffmpeg -i "${inputPath}" -vn -ar 44100 -ac 2 -b:a 192k "${outputPath}"`);
    return outputPath;
  } catch (error) {
    console.error('Error converting video to MP3:', error);
    throw new Error(`Failed to convert video to MP3: ${error.message}`);
  }
};


export const processYoutubeUrl = async (req, res) => {
  let videoPath = null;
  let mp3Path = null;
  
  try {
    const { youtubeUrl } = req.body;
    
    if (!youtubeUrl) {
      return res.status(400).json({ error: 'No YouTube URL provided' });
    }
    
    console.log(`Processing YouTube URL: ${youtubeUrl}`);
    
    try {
      // Create unique filename for the downloaded video
      const timestamp = Date.now();
      const outputDir = 'uploads';
      const outputBasename = `youtube_${timestamp}`;
      videoPath = path.join(outputDir, `${outputBasename}.mp4`);
      
      // Use yt-dlp to download the video
      console.log('Starting YouTube download with yt-dlp...');
      
      // Execute the yt-dlp command
      const ytDlpPath = process.env.YT_DLP_PATH || 'yt-dlp';
      
      await new Promise((resolve, reject) => {
        exec(`${ytDlpPath} -f "bestaudio[ext=m4a]/best[ext=mp4]/best" --max-filesize 100M --max-duration 1800 -o "${videoPath}" "${youtubeUrl}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`yt-dlp error: ${error.message}`);
            reject(new Error(`Failed to download YouTube video: ${error.message}`));
            return;
          }
          if (stderr) {
            console.log(`yt-dlp stderr: ${stderr}`);
          }
          console.log(`yt-dlp stdout: ${stdout}`);
          resolve();
        });
      });
      
      console.log(`YouTube video downloaded: ${videoPath}`);
      
      // Verify the file exists
      if (!fs.existsSync(videoPath)) {
        throw new Error('Failed to download YouTube video: File not found');
      }
      
      // Get video info for metadata
      const videoInfoCommand = `${ytDlpPath} --skip-download --print title --print id "${youtubeUrl}"`;
      const videoInfo = await new Promise((resolve, reject) => {
        exec(videoInfoCommand, (error, stdout, stderr) => {
          if (error) {
            reject(new Error(`Failed to get video info: ${error.message}`));
            return;
          }
          const [title, id] = stdout.trim().split('\n');
          resolve({ title, id });
        });
      });
      
      // Step 1: Convert to MP3
      mp3Path = await convertVideoToMp3(videoPath);
      console.log(`Converted to MP3: ${mp3Path}`);
      
      // Step 2: Get transcription from Groq
      const transcriptionResult = await transcribeAudioWithGroq(mp3Path);
      console.log('Transcription completed');
      
      // Step 3: Format subtitles for the frontend
      const formattedSubtitles = {
        text: transcriptionResult.text,
        segments: transcriptionResult.segments.map(segment => ({
          id: segment.id,
          start: segment.start,
          end: segment.end,
          text: segment.text,
          words: segment.words ? segment.words.map(word => ({
            word: word.word,
            start: word.start,
            end: word.end
          })) : []
        })),
        youtubeInfo: {
          title: videoInfo.title,
          url: youtubeUrl,
          videoId: videoInfo.id
        }
      };
      
      // Return the result
      res.json({
        success: true,
        transcription: formattedSubtitles,
      });
      
      // Clean up files immediately after sending response
      if (videoPath && fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      if (mp3Path && fs.existsSync(mp3Path)) {
        fs.unlinkSync(mp3Path);
      }
      console.log('Temporary files cleaned up');
      
    } catch (error) {
      console.error('Processing error:', error);
      // Clean up any files that might have been created
      if (videoPath && fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
      if (mp3Path && fs.existsSync(mp3Path)) {
        fs.unlinkSync(mp3Path);
      }
      return res.status(500).json({ 
        error: error.message || 'Error processing YouTube video'
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Server error processing YouTube video',
      message: error.message
    });
  }
}

// Process uploaded video for transcription
export const processVideoForTranscription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputPath = req.file.path;
    console.log(`File uploaded: ${inputPath}`);

    // Validate file size (limit to 100MB)
    const fileStats = fs.statSync(inputPath);
    const fileSizeInMB = fileStats.size / (1024 * 1024);
    if (fileSizeInMB > 100) {
      fs.unlinkSync(inputPath);
      return res.status(400).json({ error: 'File size exceeds the 100MB limit' });
    }

    try {
      // Step 1: Convert to MP3
      const mp3Path = await convertVideoToMp3(inputPath);
      console.log(`Converted to MP3: ${mp3Path}`);

      // Step 2: Get transcription from Groq
      const transcriptionResult = await transcribeAudioWithGroq(mp3Path);
      console.log('Transcription completed');

      // Step 3: Format subtitles for the frontend
      const formattedSubtitles = {
        text: transcriptionResult.text,
        segments: transcriptionResult.segments.map(segment => ({
          id: segment.id,
          start: segment.start,
          end: segment.end,
          text: segment.text,
          words: segment.words ? segment.words.map(word => ({
            word: word.word,
            start: word.start,
            end: word.end
          })) : []
        }))
      };

      // Return the result
      res.json({
        success: true,
        transcription: formattedSubtitles,
      });

      // Clean up files immediately after sending response
      try {
        fs.unlinkSync(inputPath);
        fs.unlinkSync(mp3Path);
        console.log('Temporary files cleaned up');
      } catch (cleanupErr) {
        console.error('Error cleaning up files:', cleanupErr);
      }

    } catch (error) {
      console.error('Processing error:', error);
      // Clean up the input file if there was an error
      try { fs.unlinkSync(inputPath); } catch (e) {}
      return res.status(500).json({ error: error.message || 'Error processing video' });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};