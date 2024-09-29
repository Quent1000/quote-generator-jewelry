import React from 'react';

const WaveBackground = ({ darkMode }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-teal-50 to-teal-100'}`}></div>
      <div className="absolute bottom-0 left-0 right-0 top-0">
        <svg className="absolute left-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="wave-path" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="wave-animation">
            <use xlinkHref="#wave-path" x="48" y="0" fill={darkMode ? 'rgba(76, 29, 149, 0.7)' : 'rgba(13, 148, 136, 0.1)'} className="animate-wave" />
            <use xlinkHref="#wave-path" x="48" y="3" fill={darkMode ? 'rgba(124, 58, 237, 0.5)' : 'rgba(20, 184, 166, 0.07)'} className="animate-wave-reverse" />
            <use xlinkHref="#wave-path" x="48" y="5" fill={darkMode ? 'rgba(167, 139, 250, 0.3)' : 'rgba(45, 212, 191, 0.05)'} className="animate-wave" />
            <use xlinkHref="#wave-path" x="48" y="7" fill={darkMode ? 'rgba(196, 181, 253, 0.1)' : 'rgba(153, 246, 228, 0.03)'} className="animate-wave-reverse" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default WaveBackground;