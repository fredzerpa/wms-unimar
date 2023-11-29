

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

import App from "App";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableWindowBlurListener
        dense
        style={{
          width: "350px",
          height: "80px",
          justifyContent: "center"
        }}
      >
        <App />
      </SnackbarProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);