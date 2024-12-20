import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import PageTableauDeBord from './pages/PageTableauDeBord';
import PageClients from './pages/PageClients';
import PageCreerDevisV2 from './pages/PageCreerDevisV2';
import PageParametrageDevis from './pages/PageParametrageDevis';
import LoginPage from './pages/LoginPage';
import PageProfil from './pages/PageProfil';
import PageAccesRefuse from './pages/PageAccesRefuse';
import PageGestionUtilisateurs from './pages/PageGestionUtilisateurs';
import withRoleAccess from './components/auth/withRoleAccess';
import PageAccueil from './pages/PageAccueil';
import PageDevis from './pages/PageDevis';
import DevisAdvancedPage from './components/devisAdvanced/DevisAdvancedPage';

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

  const ProtectedPageParametrageDevis = withRoleAccess(PageParametrageDevis, ['admin']);
  const ProtectedPageGestionUtilisateurs = withRoleAccess(PageGestionUtilisateurs, ['admin']);

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<PageAccueil />} />
          <Route path="/tableau-de-bord" element={<PageTableauDeBord />} />
          <Route path="/clients" element={<PageClients />} />
          <Route path="/creer-devis" element={<PageCreerDevisV2 />} />
          <Route path="/parametrage-devis" element={<ProtectedPageParametrageDevis />} />
          <Route path="/profil" element={<PageProfil />} />
          <Route path="/acces-refuse" element={<PageAccesRefuse />} />
          <Route path="/gestion-utilisateurs" element={<ProtectedPageGestionUtilisateurs />} />
          <Route path="/creer-devis-v2" element={<PageCreerDevisV2 />} />
          <Route path="/devis" element={<PageDevis />} />
          <Route path="/modifier-devis/:devisId" element={<PageCreerDevisV2 />} />
          <Route path="/devis-advanced" element={<DevisAdvancedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
