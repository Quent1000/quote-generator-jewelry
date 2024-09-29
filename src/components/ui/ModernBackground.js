import React from 'react';

const ModernBackground = ({ darkMode }) => {
  const baseColor = darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';
  const accentColor = darkMode ? 'rgba(20, 184, 166, 0.1)' : 'rgba(13, 148, 136, 0.1)';

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-teal-100'}`}></div>
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="10%" cy="20%" r="5%" fill={accentColor} className="animate-float" />
          <rect x="80%" y="60%" width="15%" height="15%" fill={baseColor} className="animate-float-reverse" />
          <polygon points="50,5 95,97 5,97" fill={baseColor} className="animate-float" style={{transformOrigin: 'center'}} />
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={baseColor} strokeWidth="0.5" />
            </pattern>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default ModernBackground;