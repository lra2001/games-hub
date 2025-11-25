import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem("access") || null);

  useEffect(() => {
    async function loadUser() {
      if (!access) return;

      try {
        const res = await api.get("users/me/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        logout();
      }
    }

    loadUser();
  }, [access]);

  function login(accessToken, refreshToken) {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    setAccess(accessToken);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAccess(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, access, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}