// src/contexts/AuthContext.js

import React, { createContext, useContext, useState } from "react";

// Erstelle den AuthContext
const AuthContext = createContext();

// Custom Hook, um den Authentifizierungsstatus zu erhalten
export const useAuth = () => useContext(AuthContext);

// AuthProvider-Komponente, die den AuthContext zur Verfügung stellt
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Login Funktion, die den Token speichert und den Zustand aktualisiert
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  // Logout Funktion, die den Token entfernt und den Zustand zurücksetzt
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // Den Kontext-Wert bereitstellen
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
