import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // obtener usuario autenticado
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (error) {
      console.log("Sesión inválida");
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // login
  const login = async (credential) => {
    const res = await api.post("/auth/google", {
      credential,
    });

    localStorage.setItem("token", res.data.token);

    setUser(res.data.user);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// hook personalizado
export function useAuth() {
  return useContext(AuthContext);
}