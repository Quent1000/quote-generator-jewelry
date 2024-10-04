import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 p-4 mt-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg max-w-xs w-64 transition-opacity duration-300 ease-in-out">
          <div className="relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-gray-800"></div>
          </div>
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;