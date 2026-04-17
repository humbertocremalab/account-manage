import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

// Componente que solo renderiza children si el usuario es admin
export const AdminOnly = ({ children, fallback = null }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : fallback;
};

// Botón que se deshabilita si no es admin
export const AdminButton = ({ children, onClick, className, disabled, ...props }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return (
      <button
        disabled
        className={`opacity-50 cursor-not-allowed ${className}`}
        title="Solo administradores pueden realizar esta acción"
        {...props}
      >
        <Lock className="w-4 h-4 mr-1 inline" />
        {children}
      </button>
    );
  }
  
  return (
    <button onClick={onClick} className={className} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

// Mensaje de solo lectura
export const ReadOnlyBadge = () => {
  const { isViewer } = useAuth();
  
  if (!isViewer) return null;
  
  return (
    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
      <Lock className="w-3 h-3 mr-1" />
      Solo lectura
    </span>
  );
};