import { useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { FaYoutube } from 'react-icons/fa';
import * as subtitleService from '../services/subtitle.service';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

function VideoImport({ onVideoSourceChange, onSubtitlesLoaded }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError, showInfo } = useNotification();

  const handleUrlImport = async () => {
    if (!videoUrl) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate URL is from YouTube
      const isYoutubeUrl = videoUrl.includes('youtube.com/') || videoUrl.includes('youtu.be/');
      if (!isYoutubeUrl) {
        throw new Error('Please enter a valid YouTube URL');
      }
      
      showInfo('Processing YouTube video. This may take a few minutes...');
      
      if (onVideoSourceChange) {
        onVideoSourceChange(videoUrl);
      }
      
      // Process YouTube URL and get subtitles
      const subtitles = await subtitleService.getYoutubeSubtitles(videoUrl);
      if (onSubtitlesLoaded && subtitles.transcription) {
        onSubtitlesLoaded(subtitles.transcription);
        showSuccess('Video imported and subtitles generated successfully!');
      }
    } catch (err) {
      const errorMessage = err.message || 'Failed to import YouTube video';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error importing YouTube video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    setError(null);
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file is a video
    if (!file.type.startsWith('video/')) {
      const errorMsg = 'Please select a valid video file';
      setError(errorMsg);
      showError(errorMsg);
      return;
    }
    
    setVideoFile(file);
    const fileUrl = URL.createObjectURL(file);
    if (onVideoSourceChange) {
      onVideoSourceChange(fileUrl);
    }
    
    setIsLoading(true);
    showInfo('Processing video and generating subtitles. This may take a few minutes...');
    
    try {
      const subtitles = await subtitleService.getFileSubtitles(file);
      if (onSubtitlesLoaded) {
        onSubtitlesLoaded(subtitles.transcription);
        showSuccess('Video processed and subtitles generated successfully!');
      }
    } catch (err) {
      const errorMsg = 'Failed to generate subtitles. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
      console.error('Error fetching subtitles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mb-6 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Import Video</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setInputMethod('url')}
              className={`p-2 rounded-md transition-colors ${
                inputMethod === 'url'
                  ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-label="YouTube URL"
              title="YouTube URL"
            >
              <FaYoutube className="h-5 w-5" />
            </button>
            <button
              onClick={() => setInputMethod('file')}
              className={`p-2 rounded-md transition-colors ${
                inputMethod === 'file'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-label="Upload file"
              title="Upload file"
            >
              <ArrowUpTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        {inputMethod === 'url' ? (
          <div className="flex items-center space-x-2">
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste YouTube URL here..."
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={handleUrlImport}
              disabled={!videoUrl || isLoading}
              className="shrink-0 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Import</span>
              )}
            </button>
          </div>
        ) : (
          <div className="relative group">
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
            <label
              htmlFor="videoFile"
              className={`flex items-center justify-center w-full px-3 py-6 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                isLoading 
                  ? 'border-gray-300 dark:border-gray-700' 
                  : videoFile 
                    ? 'border-green-300 dark:border-green-700 hover:border-green-400 dark:hover:border-green-600' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500'
              }`}
            >
              {isLoading ? (
                <div className="text-center">
                  <LoadingSpinner size="medium" message="Processing video..." />
                </div>
              ) : videoFile ? (
                <div className="text-center">
                  <ArrowUpTrayIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{videoFile.name}</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to select a different file
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <ArrowUpTrayIcon className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload video file</span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Supports MP4, MOV, AVI, and other video formats
                  </p>
                </div>
              )}
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoImport;