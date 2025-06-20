import { useState, useEffect } from 'react';
import VideoImport from './components/VideoImport';
import VideoPlayer from './components/VideoPlayer';
import SubtitlesDisplay from './components/SubtitlesDisplay';
import DictionaryPanel from './components/DictionaryPanel';
import SubtitleControls from './components/SubtitleControls';
import SavedWords from './components/SavedWords';
import ThemeToggle from './components/ThemeToggle';
import WelcomeMessage from './components/WelcomeMessage';
import GlobalError from './components/GlobalError';
import ConnectionStatus from './components/ConnectionStatus';
import { useNotification } from './context/NotificationContext';
import './App.css';

function App() {
  const [videoSource, setVideoSource] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [savedWords, setSavedWords] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const { showSuccess, showInfo, showError } = useNotification();

  // Load saved words from localStorage
  useEffect(() => {
    const savedWordsFromStorage = localStorage.getItem('caplearn-saved-words');
    if (savedWordsFromStorage) {
      try {
        setSavedWords(JSON.parse(savedWordsFromStorage));
      } catch (error) {
        console.error('Error parsing saved words from localStorage:', error);
      }
    }
  }, []);

  // Save words to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('caplearn-saved-words', JSON.stringify(savedWords));
  }, [savedWords]);

  const formatSrtTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleSaveWord = (wordData) => {
    if (!savedWords.some(item => item.word === wordData.word)) {
      // Add timestamp and empty categories array when saving a new word
      const wordWithMeta = {
        ...wordData,
        addedAt: Date.now(),
        categories: []
      };
      setSavedWords([...savedWords, wordWithMeta]);
      showSuccess(`Added "${wordData.word}" to your saved words`);
    } else {
      showInfo(`"${wordData.word}" is already in your saved words`);
    }
  };

  const handleRemoveWord = (word) => {
    setSavedWords(savedWords.filter(item => item.word !== word));
    showInfo(`Removed "${word}" from your saved words`);
  };
  
  const handleUpdateWord = (updatedWord) => {
    setSavedWords(
      savedWords.map(word => 
        word.word === updatedWord.word ? updatedWord : word
      )
    );
  };

  const handleVideoSourceChange = (source) => {
    setVideoSource(source);
    setShowPlayer(true);
    setSubtitles([]);
    setSelectedWord('');
  };

  const handleSubtitlesLoaded = (subs) => {
    setSubtitles(subs);
    setShowPlayer(true);
  };

  return (
    <div className="min-h-screen px-20 bg-white dark:bg-black text-gray-900 dark:text-white transition-all duration-200">
      <div className="w-full px-2 py-6">
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">CapLearn</h1>
          <div className="flex items-center gap-4">
            <ConnectionStatus />
            <ThemeToggle />
          </div>
        </div>
        
        <div className="px-4 mb-6">
          <VideoImport 
            onVideoSourceChange={handleVideoSourceChange} 
            onSubtitlesLoaded={handleSubtitlesLoaded} 
            onError={(error) => setGlobalError({ message: error })}
          />
        </div>
        
        {!showPlayer ? (
          <div className="px-4">
            <WelcomeMessage />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 px-4">
            {/* Left column: Video and Subtitles */}
            <div className="lg:w-2/3 space-y-6">
              <VideoPlayer
                videoSource={videoSource}
                onProgress={setCurrentTime}
                onError={(error) => setGlobalError({ message: error })}
              />
              
              {subtitles && subtitles.segments && subtitles.segments.length > 0 ? (
                <SubtitlesDisplay 
                  currentTime={currentTime} 
                  subtitles={subtitles} 
                  onWordClick={setSelectedWord} 
                />
              ) : (
                <SubtitleControls
                  subtitles={subtitles}
                  onSubtitlesUpload={(parsedSubtitles) => {
                    // Handle parsed subtitles here
                    console.log("Parsed subtitles:", parsedSubtitles);
                  }}
                  onGenerateSubtitles={async () => {
                    // Implement subtitle generation logic
                    console.log("Generating subtitles...");
                  }}
                />
              )}
            </div>
            
            {/* Right column: Dictionary and Saved Words */}
            <div className="lg:w-1/3 space-y-6">
              {selectedWord ? (
                <DictionaryPanel 
                  word={selectedWord} 
                  onSaveWord={handleSaveWord} 
                />
              ) : (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Click on any word in the subtitles to see its definition here
                  </p>
                </div>
              )}
              
              {savedWords.length > 0 && (
                <SavedWords 
                  savedWords={savedWords} 
                  onRemoveWord={handleRemoveWord}
                  onUpdateWord={handleUpdateWord}
                />
              )}
            </div>
          </div>
        )}
      </div>
      
      <GlobalError 
        error={globalError} 
        resetError={() => setGlobalError(null)} 
      />
      <ConnectionStatus />
    </div>
  );
}

export default App;
