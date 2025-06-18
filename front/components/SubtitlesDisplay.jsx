import { useState, useEffect } from 'react';

function SubtitlesDisplay({ currentTime, subtitles, onWordClick }) {
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  
  useEffect(() => {
    // Find the subtitle that should be displayed at the current time
    if (subtitles && subtitles.length > 0) {
      const active = subtitles.find(
        sub => currentTime >= sub.startTime && currentTime <= sub.endTime
      );
      setCurrentSubtitle(active || null);
    }
  }, [currentTime, subtitles]);

  const handleWordClick = (word) => {
    if (onWordClick) {
      // Clean the word (remove punctuation)
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
      onWordClick(cleanWord);
    }
  };

  if (!currentSubtitle) {
    return <div className="h-16 flex items-center justify-center text-gray-500">No subtitles available</div>;
  }

  // Split the text into words to make them individually clickable
  const words = currentSubtitle.text.split(' ');

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-center text-lg">
        {words.map((word, index) => (
          <span 
            key={index}
            onClick={() => handleWordClick(word)}
            className="mx-1 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 px-1 py-0.5 rounded"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SubtitlesDisplay;