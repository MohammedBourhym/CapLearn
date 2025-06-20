import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const OnlineStatusContext = createContext({
  isOnline: true,
  isBackendAvailable: true,
  checkBackend: () => {},
});

export function useOnlineStatus() {
  return useContext(OnlineStatusContext);
}

export function OnlineStatusProvider({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const [lastChecked, setLastChecked] = useState(0);

  // Handle browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check backend on mount and when online status changes
  useEffect(() => {
    if (isOnline) {
      checkBackend();
    } else {
      setIsBackendAvailable(false);
    }
  }, [isOnline]);

  const checkBackend = async () => {
    // Don't check more than once every 10 seconds
    const now = Date.now();
    if (now - lastChecked < 10000) return;
    
    setLastChecked(now);
    
    try {
      const response = await axios.get('http://localhost:3000/', { 
        timeout: 5000 
      });
      setIsBackendAvailable(response.status === 200);
    } catch (error) {
      console.error('Backend connection check failed:', error);
      setIsBackendAvailable(false);
    }
  };

  return (
    <OnlineStatusContext.Provider value={{ isOnline, isBackendAvailable, checkBackend }}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export default OnlineStatusContext;
