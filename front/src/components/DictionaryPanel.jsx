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
      <div className="h-full flex items-center justify-center text-gray-500">
        Click on a word in the subtitles to see its definition
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{word}</h3>
        <button 
          onClick={handleSaveWord}
          disabled={!definition || savedWords?.some(w => w.word === word)}
          className={`px-3 py-1 rounded-md text-sm ${
            !definition || savedWords?.some(w => w.word === word)
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {savedWords?.some(w => w.word === word) ? 'Saved' : 'Save Word'}
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {definition && (
        <div>
          {definition.phonetics && definition.phonetics.length > 0 && (
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300">
                {definition.phonetics[0].text}
              </p>
              {definition.phonetics[0].audio && (
                <button 
                  onClick={() => new Audio(definition.phonetics[0].audio).play()}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Listen
                </button>
              )}
            </div>
          )}
          
          {definition.meanings && definition.meanings.map((meaning, index) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                {meaning.partOfSpeech}
              </h4>
              <ul className="list-disc pl-5 mt-2">
                {meaning.definitions.slice(0, 3).map((def, idx) => (
                  <li key={idx} className="text-gray-700 dark:text-gray-300 mb-2">
                    {def.definition}
                    {def.example && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm italic mt-1">
                        "{def.example}"
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DictionaryPanel;