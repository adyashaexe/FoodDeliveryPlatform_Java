import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("foodly_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("foodly_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/api/auth/me");
        setUser(data);
        localStorage.setItem("foodly_user", JSON.stringify(data));
      } catch {
        localStorage.removeItem("foodly_token");
        localStorage.removeItem("foodly_user");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [token]);

  async function signup(payload) {
    const { data } = await api.post("/api/auth/signup", payload);
    persistSession(data);
    return data;
  }

  async function login(payload) {
    const { data } = await api.post("/api/auth/login", payload);
    persistSession(data);
    return data;
  }

  function logout() {
    localStorage.removeItem("foodly_token");
    localStorage.removeItem("foodly_user");
    setToken(null);
    setUser(null);
  }

  function persistSession(data) {
    localStorage.setItem("foodly_token", data.token);
    localStorage.setItem("foodly_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "ADMIN",
        signup,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
