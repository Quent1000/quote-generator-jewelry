import React, { useState, useEffect } from 'react';

const Ripple = ({ color = 'rgba(255, 255, 255, 0.7)', duration = 850 }) => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ripples.length < 3) {
        setRipples(prev => [...prev, {
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 80
        }]);
      }
    }, duration / 2);

    return () => clearInterval(interval);
  }, [ripples, duration]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prev => prev.slice(1));
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [ripples, duration]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ripples.map((ripple, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-ripple"
          style={{
            left: `${ripple.x}%`,
            top: `${ripple.y}%`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
            backgroundColor: color,
            animation: `ripple ${duration}ms ease-out`,
          }}
        />
      ))}
    </div>
  );
};

export default Ripple;