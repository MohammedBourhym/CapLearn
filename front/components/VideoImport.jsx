import { useState } from 'react';

function VideoImport({ onVideoSourceChange }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url'); // 'url' or 'file'

  const handleUrlImport = () => {
    if (videoUrl && onVideoSourceChange) {
      onVideoSourceChange(videoUrl);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileUrl = URL.createObjectURL(file);
      if (onVideoSourceChange) {
        onVideoSourceChange(fileUrl);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Import Video</h2>
      
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setInputMethod('url')}
          className={`px-4 py-2 rounded-md ${
            inputMethod === 'url' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          YouTube URL
        </button>
        <button
          onClick={() => setInputMethod('file')}
          className={`px-4 py-2 rounded-md ${
            inputMethod === 'file' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          Upload File
        </button>
      </div>

      {inputMethod === 'url' ? (
        <div className="space-y-4">
          <div>
            <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              YouTube Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            onClick={handleUrlImport}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Import Video
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upload Video File
            </label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {videoFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected file: {videoFile.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoImport;