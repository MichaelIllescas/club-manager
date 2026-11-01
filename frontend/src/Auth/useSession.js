import { createContext, useContext } from "react";

// Datos del usuario logueado; los carga SessionProvider
export const SessionContext = createContext({ usuario: null, rol: null, cargando: true });

export function useSession() {
  return useContext(SessionContext);
}
