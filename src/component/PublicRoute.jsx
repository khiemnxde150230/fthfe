import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const PublicRoute = ({ element }) => {
  const { token, user } = useContext(UserContext);
  const location = useLocation();

  if (token && location.pathname === '/login') {
    switch (user?.roleId) {
      case 1: return <Navigate to="/admin/dashboard" replace />;
      case 2: return <Navigate to="/" replace />;
      case 3: return <Navigate to="/organizer/events" replace />;
      case 4: return <Navigate to="/staff/checkin" replace />;
      default: return <Navigate to="/" replace />;
    }
  }
  else if (token && location.pathname === '/') {
    switch (user?.roleId) {
      case 1: return <Navigate to="/admin/dashboard" replace />;
      case 3: return <Navigate to="/organizer/events" replace />;
      case 4: return <Navigate to="/staff/checkin" replace />;
    }
  }

  return element;
};

export default PublicRoute;