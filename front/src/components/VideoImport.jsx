import { useState } from 'react';
import { VideoCameraIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import { FaYoutube } from 'react-icons/fa';
import subtitleService from '../services/subtitle.service';




function VideoImport({ onVideoSourceChange, onSubtitlesLoaded }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [inputMethod, setInputMethod] = useState('url');

  const handleUrlImport = () => {
    if (videoUrl && onVideoSourceChange) {
      onVideoSourceChange(videoUrl);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      const fileUrl = URL.createObjectURL(file);
      if (onVideoSourceChange) {
        onVideoSourceChange(fileUrl);
      }
      // Call backend to get subtitles
      try {
        const subtitles = await subtitleService.getFileSubtitles(file);
        if (onSubtitlesLoaded) {
          onSubtitlesLoaded(subtitles);
        }
      } catch (err) {
        alert('Failed to fetch subtitles from server.');
      }
    } else {
      return alert('Please select a video file');
    }
  }


    return (
      <header className="w-full   border  py-5 px-6 rounded-lg">
        <div className=" mx-auto flex items-center justify-between">


          <div className="flex-1 max-w-3xl ">
            {inputMethod === 'url' ? (
              <div className="flex items-center space-x-3">
                <input
                  type="url"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube URL here..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleUrlImport}
                  className="border  text-red-500 py-3 px-6 rounded-lg hover:bg-red-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center space-x-2"
                >
                  <VideoCameraIcon className="h-5 w-5" />

                  <span>Import</span>
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

                />
                <label
                  htmlFor="videoFile"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer group-hover:border-blue-500 transition-all duration-200"
                >
                  <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 mr-2" />
                  <span className="text-gray-500 group-hover:text-blue-500">
                    {videoFile ? videoFile.name : "Click to upload video file"}
                  </span>
                </label>
              </div>


            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setInputMethod('url')}
              className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-all duration-200 ${inputMethod === 'url'
                ? 'border border-red-500 text-red-600  bg-red-200 shadow-lg '
                : 'border border-red-300 text-red-400 hover:bg-red-200'
                }`}
            >
              <FaYoutube className=" h-5 w-5" />

            </button>

            <button
              onClick={() => setInputMethod('file')}
              className={`flex items-center space-x-2 px-3 py-3 rounded-md transition-all duration-200 ${inputMethod === 'file'
                ? 'border border-blue-500 text-blue-600 bg-blue-200 shadow-lg '
                : 'border border-blue-300 text-blue-300 hover:bg-blue-200'
                }`}
            >
              <ArrowUpTrayIcon className="h-5 w-5" />


            </button>
          </div>
        </div>
      </header>
    );
  }


export default VideoImport;