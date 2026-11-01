import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./GeneralStyles.css";
import "./theme.css";

import AppRoutes from "./Navbar/AppRoutes";
import ExpiredSessionModal from "./Auth/ExpiredSessionModal";
import { SessionProvider } from "./Auth/SessionContext";
  
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
        <SessionProvider>
          <ExpiredSessionModal />
          <AppRoutes />
        </SessionProvider>
      </BrowserRouter>
  </StrictMode>
);
