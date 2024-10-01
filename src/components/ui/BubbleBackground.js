import React from 'react';

const BubbleBackground = ({ darkMode }) => {
  const bubbleColors = darkMode
    ? ['from-blue-500 to-purple-600', 'from-pink-500 to-red-500', 'from-green-400 to-cyan-500']
    : ['from-teal-200 to-cyan-200', 'from-yellow-200 to-orange-200', 'from-blue-200 to-indigo-200'];

  const bgClass = darkMode
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
    : 'bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-100';

  const bubbles = Array(15).fill().map((_, i) => ({
    size: 20 + Math.random() * 80,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDelay: `${Math.random() * 4}s`,
    color: bubbleColors[i % bubbleColors.length],
  }));

  return (
    <div className={`absolute inset-0 ${bgClass} overflow-hidden`}>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${bubble.color} opacity-30`}
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            animationDelay: bubble.animationDelay,
          }}
        >
          <div 
            className={`w-full h-full rounded-full animate-${index % 3 === 0 ? 'float-slow' : index % 3 === 1 ? 'float-medium' : 'float-fast'}`}
          />
        </div>
      ))}
    </div>
  );
};

export default BubbleBackground;