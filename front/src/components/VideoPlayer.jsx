import { useState, useRef, useEffect } from 'react';
import ReactPlayer from "react-player";
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from './LoadingSpinner';

function VideoPlayer({ videoSource, onProgress, onError }) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);
  const { showError } = useNotification();

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (onProgress) onProgress(state.playedSeconds);
  };
  
  const handleError = (err) => {
    console.error('Video player error:', err);
    setError('Failed to play video. Please try another source.');
    if (onError) onError('Failed to play video. Please try another source.');
    showError('Failed to play video. Please try another source.');
  };
  
  const handleReady = () => {
    setLoading(false);
    setError(null);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg border border-gray-700 h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <LoadingSpinner size="large" message="Loading video..." />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10 p-4">
          <div className="text-center text-white">
            <p className="text-red-400 mb-2">⚠️ {error}</p>
            <button 
              onClick={() => setError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      <ReactPlayer
        ref={playerRef}
        url={videoSource}
        width="100%"
        height="auto"
        playing={playing}
        controls={true}
        onProgress={handleProgress}
        onError={handleError}
        onReady={handleReady}
        progressInterval={100}
        className="aspect-video"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
              className: 'w-full h-full'
            }
          },
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              showinfo: 0
            }
          }
        }}
      />
    </div>
  );
}


export default VideoPlayer;

