import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAdmin: boolean;
  currentUsername: string;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Identifiants admin par défaut (à changer dans les paramètres)
const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const adminToken = localStorage.getItem("quality_portal_admin_token");
    const storedUsername = localStorage.getItem("quality_portal_admin_username") || DEFAULT_ADMIN_USERNAME;

    if (adminToken === "authenticated") {
      setIsAdmin(true);
      setCurrentUsername(storedUsername);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Récupérer les identifiants configurés ou utiliser les valeurs par défaut
    const storedUsername = localStorage.getItem("quality_portal_admin_username") || DEFAULT_ADMIN_USERNAME;
    const storedPassword = localStorage.getItem("quality_portal_admin_password") || DEFAULT_ADMIN_PASSWORD;

    if (username === storedUsername && password === storedPassword) {
      setIsAdmin(true);
      setCurrentUsername(username);
      localStorage.setItem("quality_portal_admin_token", "authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    setCurrentUsername("");
    localStorage.removeItem("quality_portal_admin_token");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, currentUsername, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
