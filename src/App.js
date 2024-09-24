import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import PageTableauDeBord from './pages/PageTableauDeBord';
import PageClients from './pages/PageClients';
import PageCreerDevis from './pages/PageCreerDevis';
import PageParametrageDevis from './pages/PageParametrageDevis';
import LoginPage from './pages/LoginPage';
import PageProfil from './pages/PageProfil';

const App = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </AppProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<PageTableauDeBord />} />
          <Route path="/clients" element={<PageClients />} />
          <Route path="/creer-devis" element={<PageCreerDevis />} />
          <Route path="/parametrage-devis" element={<PageParametrageDevis />} />
          <Route path="/profil" element={<PageProfil />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;