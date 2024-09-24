import React from 'react';
import { AppProvider } from './context/AppContext';
import DevisApp from './components/DevisApp';

function App() {
  return (
    <AppProvider>
      <DevisApp />
    </AppProvider>
  );
}

export default App;