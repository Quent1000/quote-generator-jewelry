import React from 'react';

const DotBackground = ({ darkMode }) => {
  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200';

  const dotClass = darkMode
    ? 'text-gray-800'
    : 'text-teal-200';

  return (
    <div className={`absolute inset-0 ${bgClass} animate-gradient`}>
      <div className={`absolute inset-0 bg-dot-pattern bg-dot-size ${dotClass} opacity-20`}></div>
    </div>
  );
};

export default DotBackground;