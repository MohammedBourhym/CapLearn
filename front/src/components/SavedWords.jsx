import { useState } from 'react';

function SavedWords({ savedWords, onRemoveWord }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!savedWords || savedWords.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">Saved Words ({savedWords.length})</h3>
        <span className="text-gray-500">
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>
      
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {savedWords.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
            >
              <span className="font-medium">{item.word}</span>
              <button
                onClick={() => onRemoveWord(item.word)}
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedWords;