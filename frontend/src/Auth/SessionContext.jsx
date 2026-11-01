import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import apiClient from "../Config/axiosConfig";
import { SessionContext } from "./useSession";

// The session cookie is HttpOnly: the frontend cannot read the token,
// so it asks the backend for the logged-in user.
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.location.pathname === "/") {
      setLoading(false);
      return;
    }
    apiClient
      .get("/api/users/me")
      .then((response) => setUser(response.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SessionContext.Provider value={{ user, role: user?.role ?? null, loading }}>
      {children}
    </SessionContext.Provider>
  );
}

SessionProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
