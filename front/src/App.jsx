import { useState, useEffect } from 'react';
import VideoImport from './components/VideoImport';
import VideoPlayer from './components/VideoPlayer';
import SubtitlesDisplay from './components/SubtitlesDisplay';
import DictionaryPanel from './components/DictionaryPanel';
import SubtitleControls from './components/SubtitleControls';
import SavedWords from './components/SavedWords';
import ThemeToggle from './components/ThemeToggle';
import WelcomeMessage from './components/WelcomeMessage';
import './App.css';

function App() {
  const [videoSource, setVideoSource] = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [subtitles, setSubtitles] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [savedWords, setSavedWords] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);

  // Mock function for generating subtitles
  const handleGenerateSubtitles = async () => {
    // In a real app, this would call your backend API
    console.log('Generating subtitles for:', videoSource);

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock subtitles
    const mockSubtitles = [
      { startTime: 1, endTime: 4, text: "Hello and welcome to this video about React and Tailwind." },
      { startTime: 5, endTime: 8, text: "Today we'll learn how to build interactive applications." },
      { startTime: 9, endTime: 12, text: "Let's start by understanding the fundamentals of components." },
      // Add more mock subtitles as needed
    ];

    setSubtitles(mockSubtitles);
    return mockSubtitles;
  };

  const handleDownloadSubtitles = () => {
    if (subtitles.length === 0) return;

    // Convert subtitles to SRT format
    let srtContent = '';
    subtitles.forEach((sub, index) => {
      const startTime = formatSrtTime(sub.startTime);
      const endTime = formatSrtTime(sub.endTime);

      srtContent += `${index + 1}\n`;
      srtContent += `${startTime} --> ${endTime}\n`;
      srtContent += `${sub.text}\n\n`;
    });

    // Create and download the file
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subtitles.srt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSrtTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const handleSaveWord = (wordData) => {
    if (!savedWords.some(item => item.word === wordData.word)) {
      setSavedWords([...savedWords, wordData]);
    }
  };

  const handleRemoveWord = (word) => {
    setSavedWords(savedWords.filter(item => item.word !== word));
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
    <div className="  text-gray-900 dark:text-white transition-colors duration-200">


      <div >
        <div className='flex  space-x-3'>
        <VideoImport onVideoSourceChange={handleVideoSourceChange} onSubtitlesLoaded={handleSubtitlesLoaded} />
        <ThemeToggle></ThemeToggle>
        </div>
        {!showPlayer ? (
        
            <WelcomeMessage />
          
    
        ) : (

          <div className='w-full' >
        
            <div className='h-full px-4 py-4'>
              <VideoPlayer className='w-full h-full'
                videoSource={videoSource}
                onProgress={setCurrentTime}
              />




            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
