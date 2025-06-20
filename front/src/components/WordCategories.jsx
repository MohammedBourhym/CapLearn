import { useState, useEffect } from 'react';
import { PlusIcon, XMarkIcon, TagIcon } from '@heroicons/react/24/outline';

function WordCategories({ savedWords, onUpdateWord }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load categories from localStorage on component mount
  useEffect(() => {
    const storedCategories = localStorage.getItem('caplearn-categories');
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error parsing categories from localStorage:', error);
      }
    }
  }, []);
  
  // Save categories to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('caplearn-categories', JSON.stringify(categories));
  }, [categories]);
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setShowAddForm(false);
    }
  };
  
  const handleRemoveCategory = (categoryToRemove) => {
    // Remove the category
    setCategories(categories.filter(category => category !== categoryToRemove));
    
    // Remove this category from all words that have it
    savedWords.forEach(word => {
      if (word.categories && word.categories.includes(categoryToRemove)) {
        const updatedCategories = word.categories.filter(cat => cat !== categoryToRemove);
        onUpdateWord({ ...word, categories: updatedCategories });
      }
    });
  };
  
  const toggleWordCategory = (word, category) => {
    const currentCategories = word.categories || [];
    let updatedCategories;
    
    if (currentCategories.includes(category)) {
      // Remove category
      updatedCategories = currentCategories.filter(cat => cat !== category);
    } else {
      // Add category
      updatedCategories = [...currentCategories, category];
    }
    
    onUpdateWord({ ...word, categories: updatedCategories });
  };
  
  if (!categories.length && !showAddForm) {
    return (
      <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <span className="text-sm text-blue-600 dark:text-blue-400">
          <TagIcon className="h-4 w-4 inline mr-1" />
          Add categories to organize your vocabulary
        </span>
        <button
          onClick={() => setShowAddForm(true)}
          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
    );
  }
  
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <TagIcon className="h-4 w-4 mr-1" />
          Categories
        </h4>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {showAddForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>
      
      {showAddForm && (
        <div className="mb-3 flex items-center">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name..."
            className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="px-2 py-1 bg-blue-600 text-white text-sm rounded-r-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group flex items-center text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
            >
              <span>{category}</span>
              <button
                onClick={() => handleRemoveCategory(category)}
                className="ml-1 opacity-50 group-hover:opacity-100 transition-opacity"
                title="Remove category"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {savedWords.length > 0 && categories.length > 0 && (
        <div className="max-h-40 overflow-y-auto pr-1 border-t border-gray-200 dark:border-gray-700 pt-2">
          <table className="min-w-full text-sm">
            <thead className="text-xs text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left py-1 px-2">Word</th>
                <th className="text-left py-1 px-2">Categories</th>
              </tr>
            </thead>
            <tbody>
              {savedWords.map((word, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                  <td className="py-1 px-2 font-medium text-gray-700 dark:text-gray-300">{word.word}</td>
                  <td className="py-1 px-2">
                    <div className="flex flex-wrap gap-1">
                      {categories.map((category, catIndex) => (
                        <button
                          key={catIndex}
                          onClick={() => toggleWordCategory(word, category)}
                          className={`text-xs px-1.5 py-0.5 rounded-sm ${
                            (word.categories || []).includes(category)
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 opacity-50'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WordCategories;
