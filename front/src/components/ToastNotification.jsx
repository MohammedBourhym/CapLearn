import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Types of notifications
// - success: green
// - error: red
// - info: blue
// - warning: yellow

function ToastNotification({ message, type = 'info', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  // Define background and text colors based on type
  const colors = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-800',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800',
  };

  const iconTypes = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`fixed bottom-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border ${colors[type]} transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'} flex items-start`}
      role="alert"
    >
      <div className="mr-2">
        {iconTypes[type]}
      </div>
      <div className="flex-1">
        {message}
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(), 300);
        }}
        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default ToastNotification;
