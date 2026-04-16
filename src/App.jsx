import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmbudoMeta from './pages/EmbudoMeta';
import Eventos from './pages/Eventos';
import Insumos from './pages/Insumos';
import TareasExpress from './pages/TareasExpress';
import Reporte from './pages/Reporte';
import Header from './components/layout/Header';
import TabNavigation from './components/layout/TabNavigation';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TabNavigation />
      <Routes>
        <Route path="/" element={<Navigate to="/embudo-meta" />} />
        <Route path="/embudo-meta" element={<EmbudoMeta />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/insumos" element={<Insumos />} />
        <Route path="/express" element={<TareasExpress />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="*" element={<Navigate to="/embudo-meta" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;