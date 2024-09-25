import React, { useState, useEffect, useRef } from 'react';

const TagInput = ({ tags, setTags, suggestions, darkMode, inputClass }) => {
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState(tags);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault();
      addTag(input.trim());
    }
  };

  const addTag = (tag) => {
    if (!localTags.includes(tag)) {
      const newTags = [...localTags, tag];
      setLocalTags(newTags);
      setTags(newTags);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove) => {
    const newTags = localTags.filter(tag => tag !== tagToRemove);
    setLocalTags(newTags);
    setTags(newTags);
  };

  const containerClass = `flex flex-wrap items-center ${inputClass}`;
  const tagClass = `bg-teal-100 text-teal-800 rounded-full px-2 py-1 text-sm mr-2 mb-2 ${darkMode ? 'bg-teal-700 text-teal-100' : ''}`;
  const suggestionsClass = `absolute z-10 mt-1 w-full border rounded shadow-lg max-h-40 overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`;
  const suggestionItemClass = `p-2 cursor-pointer ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`;

  return (
    <div className="relative">
      <div className={containerClass}>
        {localTags.map(tag => (
          <span key={tag} className={tagClass}>
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 text-teal-600 hover:text-teal-800">&times;</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="flex-grow outline-none bg-transparent"
          placeholder="Ajouter un tag..."
        />
      </div>
      {showSuggestions && input && (
        <div ref={suggestionsRef} className={suggestionsClass}>
          {suggestions
            .filter(s => s.toLowerCase().includes(input.toLowerCase()))
            .map(suggestion => (
              <div
                key={suggestion}
                className={suggestionItemClass}
                onClick={() => addTag(suggestion)}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;