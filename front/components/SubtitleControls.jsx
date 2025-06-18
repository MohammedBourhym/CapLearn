import { useState } from 'react';

function SubtitleControls({ onSubtitlesUpload, onGenerateSubtitles, onDownloadSubtitles }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.srt') || file.name.endsWith('.vtt'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        // Parse the subtitle file content
        const parsedSubtitles = parseSubtitles(content, file.name.endsWith('.srt') ? 'srt' : 'vtt');
        if (onSubtitlesUpload) {
          onSubtitlesUpload(parsedSubtitles);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateSubtitles = async () => {
    if (onGenerateSubtitles) {
      setIsGenerating(true);
      try {
        await onGenerateSubtitles();
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Simple parser for SRT and VTT files
  const parseSubtitles = (content, format) => {
    if (format === 'srt') {
      // Basic SRT parsing logic
      const subtitles = [];
      const blocks = content.trim().split(/\r?\n\r?\n/);
      
      blocks.forEach(block => {
        const lines = block.split(/\r?\n/);
        if (lines.length >= 3) {
          const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
          if (timeMatch) {
            const startTime = timeToSeconds(timeMatch[1]);
            const endTime = timeToSeconds(timeMatch[2]);
            const text = lines.slice(2).join(' ');
            
            subtitles.push({ startTime, endTime, text });
          }
        }
      });
      
      return subtitles;
    } else if (format === 'vtt') {
      // Basic VTT parsing logic
      const subtitles = [];
      const blocks = content.trim().split(/\r?\n\r?\n/);
      
      blocks.forEach(block => {
        if (block.startsWith('WEBVTT')) return;
        
        const lines = block.split(/\r?\n/);
        if (lines.length >= 2) {
          const timeMatch = lines[0].match(/(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/);
          if (timeMatch) {
            const startTime = timeToSeconds(timeMatch[1]);
            const endTime = timeToSeconds(timeMatch[2]);
            const text = lines.slice(1).join(' ');
            
            subtitles.push({ startTime, endTime, text });
          }
        }
      });
      
      return subtitles;
    }
    
    return [];
  };

  // Convert time string to seconds
  const timeToSeconds = (timeStr) => {
    const parts = timeStr.replace(',', '.').split(':');
    return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div>
        <label htmlFor="subtitleFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upload Subtitles
        </label>
        <input
          type="file"
          id="subtitleFile"
          accept=".srt,.vtt"
          onChange={handleFileUpload}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      
      <button
        onClick={handleGenerateSubtitles}
        disabled={isGenerating}
        className={`px-4 py-2 rounded-md text-white ${
          isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isGenerating ? 'Generating...' : 'Generate Subtitles'}
      </button>
      
      <button
        onClick={onDownloadSubtitles}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Download Subtitles
      </button>
    </div>
  );
}

export default SubtitleControls;