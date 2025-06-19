import { useState, useEffect } from 'react';

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // On mount, check localStorage or system preference
    const userPref = localStorage.getItem('darkMode');
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = userPref === null ? systemPref : userPref === 'true';
    setDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  useEffect(() => {
    updateTheme(darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const updateTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-black');
      document.body.classList.remove('bg-white');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-black');
      document.body.classList.add('bg-white');
    }
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 py-2 px-6 border rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
        ${darkMode ? 'bg-black text-yellow-300 border-gray-700 hover:bg-gray-900' : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-100'}`}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      )}
      <span className="hidden sm:inline text-sm font-medium">
        {darkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

export default ThemeToggle;