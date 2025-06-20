import { useState, useEffect } from 'react';
import { ChartBarIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline';

function VocabularyStats({ savedWords }) {
  const [stats, setStats] = useState({
    totalWords: 0,
    partsOfSpeech: {},
    categorized: 0,
    uncategorized: 0,
    newWords: 0,  // Words added in the last 7 days
    oldestWord: null,
    newestWord: null
  });

  useEffect(() => {
    if (!savedWords || savedWords.length === 0) return;
    
    // Calculate statistics
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Create a map for parts of speech
    const posMap = {};
    let categorizedCount = 0;
    let uncategorizedCount = 0;
    let newWordsCount = 0;
    let oldestWord = { addedAt: now };
    let newestWord = { addedAt: 0 };
    
    savedWords.forEach(word => {
      // Count parts of speech
      const pos = word.definition?.meanings?.[0]?.partOfSpeech;
      if (pos) {
        posMap[pos] = (posMap[pos] || 0) + 1;
      }
      
      // Count categorized words
      if (word.categories && word.categories.length > 0) {
        categorizedCount++;
      } else {
        uncategorizedCount++;
      }
      
      // Count new words
      if (word.addedAt && word.addedAt > oneWeekAgo) {
        newWordsCount++;
      }
      
      // Find oldest and newest words
      if (word.addedAt) {
        if (word.addedAt < oldestWord.addedAt) {
          oldestWord = word;
        }
        if (word.addedAt > newestWord.addedAt) {
          newestWord = word;
        }
      }
    });
    
    setStats({
      totalWords: savedWords.length,
      partsOfSpeech: posMap,
      categorized: categorizedCount,
      uncategorized: uncategorizedCount,
      newWords: newWordsCount,
      oldestWord: oldestWord !== null ? oldestWord : null,
      newestWord: newestWord !== null ? newestWord : null
    });
  }, [savedWords]);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get top parts of speech
  const topPartsOfSpeech = Object.entries(stats.partsOfSpeech)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (!savedWords || savedWords.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 transition-colors">
      <div className="flex items-center mb-4">
        <ChartBarIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vocabulary Statistics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalWords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.newWords}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Added This Week</div>
        </div>
      </div>

      {topPartsOfSpeech.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Top Parts of Speech
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {topPartsOfSpeech.map(([pos, count]) => (
              <div key={pos} className="bg-gray-50 dark:bg-gray-800 rounded p-2 text-center">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                  {pos}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {count} {count === 1 ? 'word' : 'words'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <TrophyIcon className="h-4 w-4 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Categories</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Categorized</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{stats.categorized}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">Uncategorized</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{stats.uncategorized}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <ClockIcon className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Timeline</span>
          </div>
          {stats.newestWord && (
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Newest</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {stats.newestWord.word ? `"${stats.newestWord.word}"` : ''} {formatDate(stats.newestWord.addedAt)}
              </span>
            </div>
          )}
          {stats.oldestWord && stats.oldestWord.word !== stats.newestWord.word && (
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Oldest</span>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {stats.oldestWord.word ? `"${stats.oldestWord.word}"` : ''} {formatDate(stats.oldestWord.addedAt)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        Keep learning! You've saved {stats.totalWords} {stats.totalWords === 1 ? 'word' : 'words'} so far.
      </div>
    </div>
  );
}

export default VocabularyStats;
