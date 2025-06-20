import React from 'react';
import { useOnlineStatus } from '../context/OnlineStatusContext';

function ConnectionStatus() {
  const { isOnline, isBackendAvailable, checkBackend } = useOnlineStatus();

  // If everything is fine, don't show anything
  if (isOnline && isBackendAvailable) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 border border-yellow-300 dark:border-yellow-800 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        <span className="text-sm text-gray-800 dark:text-gray-200">
          {!isOnline ? (
            'You are offline. Please check your internet connection.'
          ) : !isBackendAvailable ? (
            'Cannot connect to server. Some features may be unavailable.'
          ) : null}
        </span>
        {!isBackendAvailable && isOnline && (
          <button 
            onClick={checkBackend}
            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectionStatus;
