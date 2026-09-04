import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  
  // Por enquanto, vamos permitir acesso a qualquer pessoa logada (ou podemos validar o email da Safia)
  // if (!currentUser || currentUser.email !== 'seuemail@gmail.com') return <Navigate to="/" />;
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
}
