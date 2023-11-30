

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

import App from "App";
import { BillsProvider } from "context/bills.context";
import { InventoryProvider } from "context/inventory.context";
import { ProductsProvider } from "context/products.context";
import { ShippingsProvider } from "context/shippings.context";
import { StoresProvider } from "context/stores.context";
import { ProvidersProvider } from "context/providers.context";
import { AuthProvider } from "context/auth.context";


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
        <AuthProvider userData={null}>
          <ProductsProvider>
            <InventoryProvider>
              <ProvidersProvider>
                <BillsProvider>
                  <StoresProvider>
                    <ShippingsProvider>
                      <App />
                    </ShippingsProvider>
                  </StoresProvider>
                </BillsProvider>
              </ProvidersProvider>
            </InventoryProvider>
          </ProductsProvider>
        </AuthProvider>
      </SnackbarProvider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);