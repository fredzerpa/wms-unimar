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
import { ProtectedRoute } from "./ProtectedRoute";

// Contexts
import { useMaterialUIController, setMiniSidenav } from "context";
import { AuthProvider } from "context/auth.context";
import { MountPoint } from "context/confirmation.context";

// Images
import brandWhite from "assets/images/tiendas-montana.png";
import brandDark from "assets/images/tiendas-montana.png";
import { BillsProvider } from "context/bills.context";
import { InventoryProvider } from "context/inventory.context";
import { ProductsProvider } from "context/products.context";
import { ShippingsProvider } from "context/shippings.context";
import { StoresProvider } from "context/stores.context";

// react-chartjs-2 components
import { Chart as ChartJS, registerables } from 'chart.js';
import { ProvidersProvider } from "context/providers.context";
ChartJS.register(...registerables); // Fix react-chartjs-2 migration from v3 to v5

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
        if (route.protected === false) return <Route path={route.route} element={route.component} key={route.key} />;

        return (
          <Route key={route.key} element={<ProtectedRoute />}>
            <Route path={route.route} element={route.component} />
          </Route>
        );
      }

      return null;
    });

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <AuthProvider userData={null}>
        <ProductsProvider>
          <InventoryProvider>
            <ProvidersProvider>
              <BillsProvider>
                <StoresProvider>
                  <ShippingsProvider>

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

                  </ShippingsProvider>
                </StoresProvider>
              </BillsProvider>
            </ProvidersProvider>
          </InventoryProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;