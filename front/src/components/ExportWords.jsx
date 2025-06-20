import { useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportToCSV, exportToJSON, exportToAnki, downloadFile } from '../utils/exportUtils';

function ExportWords({ savedWords }) {
  const [exportFormat, setExportFormat] = useState('csv');
  
  if (!savedWords || savedWords.length === 0) {
    return null;
  }
  
  const handleExport = () => {
    let content = '';
    let filename = `caplearn-vocabulary-${new Date().toISOString().split('T')[0]}`;
    let contentType = '';
    
    switch (exportFormat) {
      case 'csv':
        content = exportToCSV(savedWords);
        filename += '.csv';
        contentType = 'text/csv;charset=utf-8';
        break;
      case 'json':
        content = exportToJSON(savedWords);
        filename += '.json';
        contentType = 'application/json;charset=utf-8';
        break;
      case 'anki':
        content = exportToAnki(savedWords);
        filename += '.txt';
        contentType = 'text/plain;charset=utf-8';
        break;
      default:
        content = exportToCSV(savedWords);
        filename += '.csv';
        contentType = 'text/csv;charset=utf-8';
    }
    
    downloadFile(content, filename, contentType);
  };
  
  return (
    <div className="flex items-center mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
      <div className="flex-1">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="text-sm px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="csv">CSV (Excel)</option>
          <option value="json">JSON</option>
          <option value="anki">Anki Flashcards</option>
        </select>
      </div>
      <button
        onClick={handleExport}
        className="ml-2 flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        <span>Export</span>
      </button>
    </div>
  );
}

export default ExportWords;
