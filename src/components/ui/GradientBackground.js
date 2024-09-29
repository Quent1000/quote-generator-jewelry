import React from 'react';

const GradientBackground = ({ darkMode }) => {
  const gradientClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900'
    : 'bg-gradient-to-br from-teal-100 via-blue-100 to-indigo-100';

  const shapeClass = darkMode
    ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
    : 'bg-gradient-to-tr from-teal-300 to-blue-300';

  return (
    <div className={`absolute inset-0 ${gradientClass} animate-gradient overflow-hidden`}>
      <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-opacity-30 animate-shape-shift" style={{background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'}}></div>
      <div className={`absolute top-3/4 left-3/4 w-1/2 h-1/2 rounded-full ${shapeClass} opacity-20 animate-shape-shift`} style={{animationDelay: '-15s'}}></div>
      <div className={`absolute top-1/4 left-1/2 w-1/3 h-1/3 rounded-full ${shapeClass} opacity-20 animate-shape-shift`} style={{animationDelay: '-7.5s'}}></div>
    </div>
  );
};

export default GradientBackground;