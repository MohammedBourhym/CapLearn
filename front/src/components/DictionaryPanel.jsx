import { useState, useEffect } from 'react';

function DictionaryPanel({ word, savedWords, onSaveWord }) {
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!word) return;
    
    const fetchDefinition = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Using the Free Dictionary API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
          throw new Error('Word not found');
        }
        
        const data = await response.json();
        setDefinition(data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinition();
  }, [word]);

  const handleSaveWord = () => {
    if (word && definition && onSaveWord) {
      onSaveWord({ word, definition });
    }
  };

  if (!word) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-8 flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 transition-colors h-full">
        <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <p>Click on a word in the subtitles to see its definition</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto transition-colors max-h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{word}</h3>
        <button 
          onClick={handleSaveWord}
          disabled={!definition || savedWords?.some(w => w.word === word)}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            !definition || savedWords?.some(w => w.word === word)
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
          }`}
        >
          {savedWords?.some(w => w.word === word) ? 'Saved' : 'Save Word'}
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md">
          {error}
        </div>
      )}
      
      {definition && (
        <div>
          {definition.phonetics && definition.phonetics.length > 0 && definition.phonetics[0].text && (
            <div className="mb-4 flex items-center">
              <p className="text-gray-700 dark:text-gray-300 mr-3 font-medium">
                {definition.phonetics[0].text}
              </p>
              {definition.phonetics[0].audio && (
                <button 
                  onClick={() => new Audio(definition.phonetics[0].audio).play()}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Listen
                </button>
              )}
            </div>
          )}
          
          {definition.meanings && definition.meanings.map((meaning, index) => (
            <div key={index} className="mb-5 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 inline-block px-3 py-1 rounded-md text-sm mb-3">
                {meaning.partOfSpeech}
              </h4>
              <ul className="list-disc pl-5 mt-2 space-y-3">
                {meaning.definitions.slice(0, 3).map((def, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300">
                    {def.definition}
                    {def.example && (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-1.5 pl-1 border-l-2 border-gray-300 dark:border-gray-600">
                        "{def.example}"
                      </p>
                    )}
                  </li>
                ))}
              </ul>
              
              {meaning.synonyms && meaning.synonyms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Synonyms:</span>
                  {meaning.synonyms.slice(0, 5).map((syn, i) => (
                    <span key={i} className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                      {syn}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DictionaryPanel;
