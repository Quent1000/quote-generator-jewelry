import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Sidebar from './layout/Sidebar';
import PageTableauDeBord from '../pages/PageTableauDeBord';
import PageCreerDevis from '../pages/PageCreerDevis';
import PageClients from '../pages/PageClients';
import PageParametrageDevis from '../pages/PageParametrageDevis';

function DevisApp() {
  const { darkMode } = useAppContext();

  return (
    <Router>
      <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
        <Sidebar />
        <main className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <Routes>
            <Route path="/" element={<PageTableauDeBord />} />
            <Route path="/creer-devis" element={<PageCreerDevis />} />
            <Route path="/clients" element={<PageClients />} />
            <Route path="/parametrage-devis" element={<PageParametrageDevis />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default DevisApp;