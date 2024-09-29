import React from 'react';
import GeometricBackground from './GeometricBackground';

const AnimatedBackground = ({ children, darkMode }) => {
  return (
    <div className="relative min-h-screen">
      <GeometricBackground darkMode={darkMode} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;