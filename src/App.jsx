import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import EmbudoMeta from './pages/EmbudoMeta';
import Eventos from './pages/Eventos';
import Insumos from './pages/Insumos';
import TareasExpress from './pages/TareasExpress';
import Reporte from './pages/Reporte';
import Usuarios from './pages/Usuarios';
import Sidebar from './components/layout/Sidebar';
import BottomNav from './components/layout/BottomNav';

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Visible en tablet y desktop (md+) */}
      <Sidebar />
      
      {/* Contenido principal - con padding bottom para mobile */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<Navigate to="/embudo-meta" />} />
          <Route path="/embudo-meta" element={<EmbudoMeta />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/express" element={<TareasExpress />} />
          <Route path="/reporte" element={<Reporte />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="*" element={<Navigate to="/embudo-meta" />} />
        </Routes>
      </div>
      
      {/* Navegación inferior - Solo visible en mobile (< md) */}
      <BottomNav />
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