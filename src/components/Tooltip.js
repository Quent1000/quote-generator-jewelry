import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-10 p-3 bg-gray-800 text-white text-sm rounded shadow-lg max-w-xs w-64 break-words">
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;