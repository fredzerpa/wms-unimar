/**
=========================================================
* Soft UI Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-material-ui
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import AuthApi from "api/auth.api";

import { useAuth } from "context/auth.context";


const SignOut = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = useCallback(async () => {
    AuthApi.logout();
    setUser(null);
    return navigate("/auth/sign-in");
  }, [navigate, setUser]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null;
}

export default SignOut;
