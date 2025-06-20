import { useState } from 'react';
import { TagIcon, BookOpenIcon, AcademicCapIcon, ArrowsUpDownIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ExportWords from './ExportWords';
import VocabularyQuiz from './VocabularyQuiz';
import WordCategories from './WordCategories';
import VocabularyStats from './VocabularyStats';

function SavedWords({ savedWords, onRemoveWord, onUpdateWord }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [sortBy, setSortBy] = useState('alphabetical');

  if (!savedWords || savedWords.length === 0) {
    return null;
  }

  // Get all categories from saved words
  const allCategories = Array.from(
    new Set(
      savedWords.flatMap(word => word.categories || [])
    )
  );

  // Filter words by search term and category
  const filteredWords = savedWords.filter(item => {
    const matchesSearch = !searchTerm || 
      item.word.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (item.categories && item.categories.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });

  // Sort words based on current sort option
  const sortedWords = [...filteredWords].sort((a, b) => {
    if (sortBy === 'alphabetical') {
      return a.word.localeCompare(b.word);
    } else if (sortBy === 'recent') {
      return (b.addedAt || 0) - (a.addedAt || 0);
    }
    return 0;
  });

  // Handle word update (for categories)
  const handleUpdateWord = (updatedWord) => {
    if (onUpdateWord) {
      onUpdateWord(updatedWord);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Saved Words ({savedWords.length})</h3>
        <div className="flex items-center">
          {savedWords.length >= 5 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowQuiz(true);
              }}
              className="mr-2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Take a vocabulary quiz"
              title="Take a vocabulary quiz"
            >
              <AcademicCapIcon className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowCategories(!showCategories);
            }}
            className="mr-2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label="Manage categories"
            title="Manage categories"
          >
            <TagIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isExpanded ? "Collapse saved words" : "Expand saved words"}
          >
            <svg className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {showQuiz && (
        <div className="mt-4">
          <VocabularyQuiz 
            savedWords={savedWords} 
            onClose={() => setShowQuiz(false)} 
          />
        </div>
      )}

      {showCategories && (
        <div className="mt-4">
          <WordCategories 
            savedWords={savedWords} 
            onUpdateWord={handleUpdateWord} 
          />
        </div>
      )}
      
      {isExpanded && !showQuiz && (
        <>
          <div className="mt-3 mb-2 space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search saved words..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  onClick={e => e.stopPropagation()}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSortBy(sortBy === 'alphabetical' ? 'recent' : 'alphabetical');
                }}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 flex items-center hover:bg-gray-200 dark:hover:bg-gray-700"
                title={`Sort by ${sortBy === 'alphabetical' ? 'most recent' : 'alphabetical'}`}
              >
                <ArrowsUpDownIcon className="h-4 w-4 mr-1" />
                {sortBy === 'alphabetical' ? 'A-Z' : 'Recent'}
              </button>
            </div>
            
            {allCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory('all');
                  }}
                  className={`text-xs px-2 py-1 rounded-md ${
                    selectedCategory === 'all'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  All
                </button>
                {allCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                    }}
                    className={`text-xs px-2 py-1 rounded-md ${
                      selectedCategory === category
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-3 max-h-60 overflow-y-auto pr-1">
            <div className="grid gap-2">
              {sortedWords.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{item.word}</span>
                      {item.categories && item.categories.length > 0 && (
                        <div className="ml-2 flex gap-1">
                          {item.categories.map((cat, i) => (
                            <span key={i} className="text-xs px-1.5 py-0.5 rounded-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {item.definition?.meanings?.[0]?.definitions?.[0]?.definition && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">
                        {item.definition.meanings[0].definitions[0].definition}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.definition?.phonetics?.[0]?.audio && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          new Audio(item.definition.phonetics[0].audio).play();
                        }}
                        className="p-1.5 rounded-full text-blue-500 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        aria-label="Listen to pronunciation"
                        title="Listen to pronunciation"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveWord(item.word);
                      }}
                      className="p-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="Remove word"
                      title="Remove word"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {sortedWords.length === 0 && (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  {searchTerm 
                    ? `No words matching "${searchTerm}"` 
                    : selectedCategory !== 'all' 
                      ? `No words in the "${selectedCategory}" category` 
                      : 'No saved words found'}
                </div>
              )}
            </div>
          </div>
          
          <ExportWords savedWords={savedWords} />
        </>
      )}
    </div>
  );
}

export default SavedWords;
