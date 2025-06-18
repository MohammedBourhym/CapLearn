import { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

function VideoPlayer({ videoSource, onProgress, onSubtitlesLoad }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (onProgress) onProgress(state.playedSeconds);
  };

  return (
    <div className="video-player-container relative">
      <ReactPlayer
        ref={playerRef}
        url={videoSource}
        width="100%"
        height="auto"
        playing={playing}
        controls={true}
        onProgress={handleProgress}
        progressInterval={100}
        className="rounded-lg overflow-hidden"
      />
      <div className="mt-4 flex justify-center">
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;