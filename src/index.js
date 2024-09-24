import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Mettez à jour ce chemin si nécessaire
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';  // Assurez-vous que cette ligne pointe vers le bon fichier

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
