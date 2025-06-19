import React from 'react';

function WelcomeMessage() {
  return (
    <div className="border   dark:border-white rounded-2xl shadow-lg w-full min-h-[400px] px-6 py-12 my-8 text-center flex flex-col items-center justify-center animate-fadeIn transition-colors duration-300">
     
      <h2 className="text-5xl font-bold text-blue-700 dark:text-blue-200 mb-10">Welcome to <span className="text-blue-800 dark:text-blue-300">CapLearn</span> </h2>

      <ol className="text-left dark:text-white mx-auto mb-4 max-w-md">
        <li className="mb-2 flex items-start"><span className="mr-2 text-blue-500 font-bold">1.</span> <span>Paste a <span className="font-semibold text-blue-600 dark:text-blue-300">YouTube link</span> or <span className="font-semibold text-blue-600 dark:text-blue-300">upload a video file</span> using the options above.</span></li>
        <li className="mb-2 flex items-start"><span className="mr-2 text-blue-500 font-bold">2.</span> <span>Click <span className="font-semibold text-blue-600 dark:text-blue-300">Import</span> to start generating subtitles automatically.</span></li>
        <li className="mb-2 flex items-start"><span className="mr-2 text-blue-500 font-bold">3.</span> <span>Explore, save, and learn new words as you watch!</span></li>
      </ol>
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg px-4 py-2 mt-2 mb-1 text-blue-600 dark:text-blue-300 text-sm inline-block">
        <span className="font-semibold">Tip:</span> For best results, use clear audio and high-quality video.
      </div>
      <p className="text-blue-400 dark:text-blue-500 text-xs mt-3">
        You can switch between YouTube and file upload anytime using the buttons above.
      </p>
    </div>
  );
}

export default WelcomeMessage;
