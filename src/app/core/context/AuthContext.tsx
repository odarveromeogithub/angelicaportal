import { createContext, useState, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    // Initialize state from localStorage
    return localStorage.getItem("access_token");
  });

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("access_token", newToken);
      setTokenState(newToken);
    } else {
      localStorage.removeItem("access_token");
      setTokenState(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
