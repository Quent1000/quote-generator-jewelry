import React from 'react';

const GeometricBackground = ({ darkMode }) => {
  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100';

  const shapeClass = darkMode
    ? 'bg-gradient-to-br from-teal-500 to-blue-600'
    : 'bg-gradient-to-br from-teal-300 to-blue-400';

  return (
    <div className={`absolute inset-0 ${bgClass} overflow-hidden`}>
      <div className="absolute inset-0 opacity-30">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${shapeClass} rounded-full mix-blend-multiply filter blur-xl animate-float-slow`} />
        <div className={`absolute top-3/4 left-1/2 w-96 h-96 ${shapeClass} rounded-full mix-blend-multiply filter blur-xl animate-float-medium`} />
        <div className={`absolute top-1/2 left-3/4 w-80 h-80 ${shapeClass} rounded-full mix-blend-multiply filter blur-xl animate-float-fast`} />
      </div>
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-4 border-teal-500 rounded-lg rotate-45 animate-pulse-slow animate-spin-slow" />
        <div className="absolute top-2/3 left-2/3 w-24 h-24 border-4 border-blue-500 rounded-full animate-pulse-slow animate-bounce-slow" style={{animationDelay: '-2s'}} />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 border-4 border-indigo-500 rounded-lg animate-pulse-slow animate-ping-slow" style={{animationDelay: '-1s'}} />
      </div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-teal-400 opacity-20 rounded-full animate-ping-slow" />
        <div className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-blue-400 opacity-20 rounded-full animate-ping-slow" style={{animationDelay: '-1.5s'}} />
      </div>
    </div>
  );
};

export default GeometricBackground;