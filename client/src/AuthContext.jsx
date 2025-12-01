// client/src/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken } from "./utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // {name, email, role, token}

  useEffect(() => {
    const stored = localStorage.getItem("jobportal_user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setAuthToken(parsed.token);
    }
  }, []);

  const login = (data) => {
    setUser(data);
    setAuthToken(data.token);
    localStorage.setItem("jobportal_user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("jobportal_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
