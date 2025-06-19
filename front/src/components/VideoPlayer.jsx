import { useState, useRef, useEffect } from 'react';
import ReactPlayer from "react-player"

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
    <div className="video-player-container relative ">
      <ReactPlayer
        ref={playerRef}
        url={videoSource}
        width="100%"
      
        playing={playing}
        controls={true}
        onProgress={handleProgress}
        progressInterval={100}
        className="rounded-lg overflow-hidden"
      />
      
    </div>
  );
}

export default VideoPlayer;