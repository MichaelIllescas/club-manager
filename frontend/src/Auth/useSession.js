import { createContext, useContext } from "react";

// Logged-in user data, loaded by SessionProvider
export const SessionContext = createContext({ user: null, role: null, loading: true });

export function useSession() {
  return useContext(SessionContext);
}
