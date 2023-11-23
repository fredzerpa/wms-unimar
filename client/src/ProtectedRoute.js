import React, { useEffect } from "react";
import { useAuth } from './context/auth.context';
import { useNavigate, Outlet } from 'react-router-dom';
import lodash from "lodash";

export const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Saltar proceso de verificacion de usuario en desarrollo
    // if (process.env.NODE_ENV === "development") return;
    
    if (!user || lodash.isEmpty(user)) {
      navigate("/auth/sign-in")
    }
  }, [navigate, user])
  
  // if (process.env.NODE_ENV === "development") return <Outlet />;
  return user && <Outlet />
};
