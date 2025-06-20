import { useState, useEffect } from 'react';
import { XMarkIcon, ArrowPathIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

function VocabularyQuiz({ savedWords, onClose }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizWords, setQuizWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizType, setQuizType] = useState('multiple-choice');

  // Prepare quiz when starting
  useEffect(() => {
    if (quizStarted && savedWords.length > 0) {
      // Shuffle the words and take up to 10
      const shuffled = [...savedWords].sort(() => 0.5 - Math.random());
      setQuizWords(shuffled.slice(0, Math.min(10, shuffled.length)));
      setCurrentWordIndex(0);
      setScore(0);
      setIsCompleted(false);
    }
  }, [quizStarted, savedWords]);

  // Generate incorrect options for multiple choice
  const generateOptions = (correctWord) => {
    if (!correctWord || !savedWords || savedWords.length < 4) return [];
    
    // Get the correct definition
    const correctDefinition = correctWord.definition?.meanings?.[0]?.definitions?.[0]?.definition || '';
    
    // Get other words for incorrect options
    const otherWords = savedWords.filter(word => word.word !== correctWord.word);
    const shuffled = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Generate all options (correct + 3 incorrect)
    const options = [
      { definition: correctDefinition, isCorrect: true },
      ...shuffled.map(word => ({
        definition: word.definition?.meanings?.[0]?.definitions?.[0]?.definition || '',
        isCorrect: false
      }))
    ];
    
    // Shuffle the options
    return options.sort(() => 0.5 - Math.random());
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentWordIndex < quizWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setShowAnswer(false);
    setScore(0);
    setIsCompleted(false);
    setSelectedOption(null);
  };

  const renderQuizContent = () => {
    if (!quizStarted) {
      return (
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Vocabulary Quiz</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quiz Type</label>
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${quizType === 'multiple-choice' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setQuizType('multiple-choice')}
              >
                Multiple Choice
              </button>
              <button
                className={`px-4 py-2 rounded-md ${quizType === 'flashcard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'}`}
                onClick={() => setQuizType('flashcard')}
              >
                Flashcards
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {savedWords.length < 5 
              ? 'You need at least 5 saved words to take a quiz.' 
              : `Test your knowledge of ${Math.min(10, savedWords.length)} random words from your saved list.`}
          </p>
          
          <button
            onClick={() => setQuizStarted(true)}
            disabled={savedWords.length < 5}
            className={`px-4 py-2 rounded-md ${
              savedWords.length < 5
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Start Quiz
          </button>
        </div>
      );
    }

    if (isCompleted) {
      // Quiz completed, show results
      return (
        <div className="text-center p-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quiz Completed!</h3>
          
          <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {score} / {quizWords.length}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              {score === quizWords.length 
                ? 'Perfect score! Amazing job!' 
                : score >= quizWords.length / 2 
                  ? 'Good job! Keep practicing.' 
                  : 'Keep studying, you\'ll get better!'}
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetQuiz}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <ArrowPathIcon className="h-5 w-5 inline mr-1" />
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    const currentWord = quizWords[currentWordIndex];
    
    if (!currentWord) {
      return <LoadingSpinner size="medium" message="Loading quiz..." />;
    }

    // Flashcard mode
    if (quizType === 'flashcard') {
      return (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentWordIndex + 1} of {quizWords.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Score: {score} / {currentWordIndex + (showAnswer ? 1 : 0)}
            </span>
          </div>
          
          <div className="mb-6 flex flex-col items-center">
            <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentWord.word}
              </h3>
              {currentWord.definition?.phonetics?.[0]?.text && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {currentWord.definition.phonetics[0].text}
                </p>
              )}
            </div>
            
            {!showAnswer ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Show Definition
                </button>
              </div>
            ) : (
              <div className="w-full">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                  <p className="text-gray-800 dark:text-gray-200">
                    {currentWord.definition?.meanings?.[0]?.definitions?.[0]?.definition || 'No definition available'}
                  </p>
                  {currentWord.definition?.meanings?.[0]?.definitions?.[0]?.example && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2 italic">
                      "{currentWord.definition.meanings[0].definitions[0].example}"
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => {
                      handleAnswer(false);
                      setTimeout(nextQuestion, 1000);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Didn't Know
                  </button>
                  <button
                    onClick={() => {
                      handleAnswer(true);
                      setTimeout(nextQuestion, 1000);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Knew It
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Multiple choice mode
    const options = generateOptions(currentWord);
    
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentWordIndex + 1} of {quizWords.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Score: {score} / {currentWordIndex + (showAnswer ? 1 : 0)}
          </span>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            What is the definition of <span className="font-bold">{currentWord.word}</span>?
          </h3>
          
          <div className="space-y-3 mt-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!showAnswer) {
                    setSelectedOption(index);
                    handleAnswer(option.isCorrect);
                    setTimeout(nextQuestion, 1500);
                  }
                }}
                disabled={showAnswer}
                className={`w-full p-3 text-left rounded-md transition-colors ${
                  showAnswer 
                    ? option.isCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border border-green-500'
                      : selectedOption === index
                        ? 'bg-red-100 dark:bg-red-900/30 border border-red-500'
                        : 'bg-gray-100 dark:bg-gray-800 opacity-50'
                    : selectedOption === index
                      ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-500'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 dark:text-gray-200">
                    {option.definition}
                  </span>
                  {showAnswer && option.isCorrect && (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  )}
                  {showAnswer && !option.isCorrect && selectedOption === index && (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 transition-colors overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {!quizStarted ? 'Vocabulary Quiz' : `Quiz ${currentWordIndex + 1}/${quizWords.length}`}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      
      {renderQuizContent()}
    </div>
  );
}

export default VocabularyQuiz;
