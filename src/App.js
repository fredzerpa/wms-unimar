import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 React example components
import Sidenav from "components/Sidenav";
import Configurator from "components/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeDark from "assets/theme-dark";

// Material Dashboard 2 React routes
import routes from "routes";

// Contexts
import { useMaterialUIController, setMiniSidenav } from "context";
import { AuthProvider } from "context/auth.context";
import { MountPoint } from "context/confirmation.context";

// Images
import brandWhite from "assets/images/logo.svg";
import brandDark from "assets/images/logo-dark.svg";

const App = () => {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <AuthProvider userData={null}>

        <MountPoint /> {/* Confirmation Context Provider */}
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandWhite : brandDark}
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
          </>
        )}
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;