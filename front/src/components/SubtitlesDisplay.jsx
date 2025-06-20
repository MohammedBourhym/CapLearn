import { useState, useEffect, useRef } from 'react';

function SubtitlesDisplay({ currentTime, subtitles, onWordClick }) {
  const [currentSegment, setCurrentSegment] = useState(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const subtitlesRef = useRef(null);
  
  useEffect(() => {
    // Find the subtitle segment that should be displayed at the current time
    if (subtitles && subtitles.segments && subtitles.segments.length > 0) {
      const active = subtitles.segments.find(
        segment => currentTime >= segment.start && currentTime <= segment.end
      );
      setCurrentSegment(active || null);
      
      // Find active word within the segment
      if (active && active.words) {
        const wordIndex = active.words.findIndex(
          word => currentTime >= word.start && currentTime <= word.end
        );
        setActiveWordIndex(wordIndex);
      } else {
        setActiveWordIndex(-1);
      }
    }
  }, [currentTime, subtitles]);

  const handleWordClick = (word) => {
    if (onWordClick) {
      // Clean the word (remove punctuation)
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
      onWordClick(cleanWord);
    }
  };

  if (!currentSegment) {
    return (
      <div className="h-16 flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 transition-colors">
        No subtitles available
      </div>
    );
  }

  // If we have word-level timestamps, use them for more precise highlighting
  if (currentSegment.words && currentSegment.words.length > 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors">
        <div ref={subtitlesRef} className="text-center text-xl leading-relaxed text-gray-900 dark:text-white max-h-60 overflow-y-auto p-2">
          {currentSegment.words.map((wordObj, index) => (
            <span 
              key={index}
              onClick={() => handleWordClick(wordObj.word)}
              className={`mx-1 cursor-pointer px-1.5 py-0.5 rounded transition-colors ${
                index === activeWordIndex
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
              }`}
            >
              {wordObj.word}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Fallback to segment-level text if no word timestamps
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="text-center text-lg text-gray-900 dark:text-white">
        {currentSegment.text.split(' ').map((word, index) => (
          <span 
            key={index}
            onClick={() => handleWordClick(word)}
            className="mx-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-0.5 rounded transition-colors"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

export default SubtitlesDisplay;