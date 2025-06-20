import React from 'react';

function WelcomeMessage() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 w-full min-h-[500px] px-8 py-14 my-8 text-center flex flex-col items-center justify-center transition-colors">
     
      <h2 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-10">Welcome to <span className="text-blue-700 dark:text-blue-300">CapLearn</span></h2>

      <div className="max-w-2xl mx-auto mb-8">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Improve your language skills by watching videos with interactive subtitles. Look up words instantly and build your vocabulary.
        </p>
      </div>

      <ol className="text-left mx-auto mb-8 max-w-md space-y-5 text-gray-900 dark:text-gray-100">
        <li className="flex items-start">
          <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium mr-3">1</span> 
          <span>Paste a <span className="font-medium text-blue-600 dark:text-blue-400">YouTube link</span> or <span className="font-medium text-blue-600 dark:text-blue-400">upload a video file</span> using the options above.</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium mr-3">2</span> 
          <span>We'll automatically generate subtitles with word-level timestamps using AI technology.</span>
        </li>
        <li className="flex items-start">
          <span className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm font-medium mr-3">3</span> 
          <span>Click on words to look them up and save for learning later.</span>
        </li>
      </ol>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-5 py-4 mt-4 text-blue-600 dark:text-blue-300 text-sm inline-block max-w-lg">
        <span className="font-medium block mb-1">Tips for best results:</span>
        <ul className="text-left list-disc pl-5 space-y-1">
          <li>Use clear audio and high-quality video</li>
          <li>Shorter videos (5-15 minutes) work best</li>
          <li>Processing may take a few minutes for longer videos</li>
        </ul>
      </div>
    </div>
  );
}

export default WelcomeMessage;
