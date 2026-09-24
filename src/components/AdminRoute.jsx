import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { isInstructor } from '../utils/authUtils';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  
  const isAuthorized = isInstructor(currentUser);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  return children;
}
