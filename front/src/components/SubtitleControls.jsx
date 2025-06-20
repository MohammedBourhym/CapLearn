import { useState } from 'react';
import { DocumentTextIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import ExportSubtitles from './ExportSubtitles';
import LoadingSpinner from './LoadingSpinner';

function SubtitleControls({ subtitles, onSubtitlesUpload, onGenerateSubtitles }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExport, setShowExport] = useState(false);

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
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subtitle Options</h3>
        <button
          onClick={() => setShowExport(!showExport)}
          disabled={!subtitles || !subtitles.segments}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
            !subtitles || !subtitles.segments 
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <DocumentTextIcon className="h-4 w-4 mr-1" />
          {showExport ? 'Hide Export' : 'Export Options'}
        </button>
      </div>
      
      {showExport && <ExportSubtitles subtitles={subtitles} />}
      
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="subtitleFile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Subtitles
          </label>
          <div className="flex">
            <input
              type="file"
              id="subtitleFile"
              accept=".srt,.vtt"
              onChange={handleFileUpload}
              className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800/40 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supports .srt and .vtt subtitle files
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Generate Subtitles
          </label>
          <button
            onClick={handleGenerateSubtitles}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-white transition-colors ${
              isGenerating 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
            }`}
          >
            {isGenerating ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span className="ml-2">Generating...</span>
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-1" />
                Generate New Subtitles
              </>
            )}
          </button>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Use AI to create new subtitles from the video audio
          </p>
        </div>
      </div>
    </div>
  );
}

export default SubtitleControls;

