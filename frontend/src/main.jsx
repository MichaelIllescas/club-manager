import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importa BrowserRouter
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./GeneralStyles.css";
import "./theme.css";

import Enrrutado from "./Navbar/Enrutmiento";
import SesionExpirada from "./Auth/SesionExpirada";
import { SessionProvider } from "./Auth/SessionContext";
  
createRoot(document.getElementById("root")).render(
  <StrictMode>
      <BrowserRouter>
        <SessionProvider>
          <SesionExpirada />
          <Enrrutado />
        </SessionProvider>
      </BrowserRouter>
  </StrictMode>
);
