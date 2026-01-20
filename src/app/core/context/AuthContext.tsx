import { createContext, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../constants/routes";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      setTokenState(null);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
