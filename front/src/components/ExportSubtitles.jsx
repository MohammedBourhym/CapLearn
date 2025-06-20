import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportToSRT, exportToVTT, downloadFile } from '../utils/exportUtils';

function ExportSubtitles({ subtitles }) {
  const [exportFormat, setExportFormat] = useState('srt');
  
  if (!subtitles || !subtitles.segments || subtitles.segments.length === 0) {
    return null;
  }
  
  const handleExport = () => {
    let content = '';
    let filename = `subtitles-${new Date().toISOString().split('T')[0]}`;
    let contentType = 'text/plain;charset=utf-8';
    
    // If subtitles have YouTube info, use video title for filename
    if (subtitles.youtubeInfo && subtitles.youtubeInfo.title) {
      // Sanitize the title for use as a filename
      filename = subtitles.youtubeInfo.title
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .toLowerCase();
    }
    
    switch (exportFormat) {
      case 'srt':
        content = exportToSRT(subtitles);
        filename += '.srt';
        break;
      case 'vtt':
        content = exportToVTT(subtitles);
        filename += '.vtt';
        break;
      case 'json':
        content = JSON.stringify(subtitles, null, 2);
        filename += '.json';
        contentType = 'application/json;charset=utf-8';
        break;
      default:
        content = exportToSRT(subtitles);
        filename += '.srt';
    }
    
    downloadFile(content, filename, contentType);
  };
  
  return (
    <div className="flex items-center space-x-2 mt-3">
      <select
        value={exportFormat}
        onChange={(e) => setExportFormat(e.target.value)}
        className="text-sm px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="srt">SRT Format</option>
        <option value="vtt">VTT Format</option>
        <option value="json">JSON Format</option>
      </select>
      <button
        onClick={handleExport}
        className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span>Export Subtitles</span>
      </button>
    </div>
  );
}

export default ExportSubtitles;
