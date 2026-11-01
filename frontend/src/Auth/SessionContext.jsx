import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiClient from "../Config/axiosConfig";
import { SessionContext } from "./useSession";

// La cookie de sesión es HttpOnly: el frontend no puede leer el token,
// así que pide al backend los datos del usuario logueado.
export function SessionProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setCargando(false);
      return;
    }
    apiClient
      .get("/api/users/perfil")
      .then((response) => setUsuario(response.data))
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, []);

  return (
    <SessionContext.Provider value={{ usuario, rol: usuario?.rol ?? null, cargando }}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
