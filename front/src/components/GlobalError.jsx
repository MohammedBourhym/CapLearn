import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

function GlobalError({ error, resetError }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (error) {
      setVisible(true);
    }
  }, [error]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      resetError();
    }, 300); // Match transition duration
  };

  if (!error) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleDismiss}
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full mx-4 p-6 border border-red-300 dark:border-red-800 transition-transform duration-300 transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-2">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Application Error</h3>
          </div>
          <button
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
            onClick={handleDismiss}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200">{error.message || 'An unexpected error occurred'}</p>
          {error.details && (
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono overflow-auto max-h-40">
              {error.details}
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            onClick={handleDismiss}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

export default GlobalError;
