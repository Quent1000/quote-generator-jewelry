import React from 'react';
import { useAppContext } from '../context/AppContext';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const ExamplePage = () => {
  const { darkMode } = useAppContext();

  return (
    <AnimatedBackground darkMode={darkMode}>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
          Titre de la page
        </h1>
        {/* Contenu de la page */}
      </div>
    </AnimatedBackground>
  );
};

export default ExamplePage;