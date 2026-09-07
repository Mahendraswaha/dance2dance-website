import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  
  // Por enquanto, vamos permitir acesso a qualquer pessoa logada (ou podemos validar o email da Safia)
  // if (!currentUser || currentUser.email !== 'seuemail@gmail.com') return <Navigate to="/" />;
  
  // Lista de emails mestres que sempre têm acesso admin
  const adminEmails = ['mahendra.swaha@gmail.com', 'contato@dance2dance.no'];
  
  const isAuthorized = currentUser && (
    adminEmails.includes(currentUser.email) ||
    currentUser.profile?.role === 'admin' ||
    currentUser.profile?.role === 'instructor'
  );

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
}
