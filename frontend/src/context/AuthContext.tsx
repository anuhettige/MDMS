import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  userId: number | null;
  token: string | null;
  userType: string | null;
  username: string | null;

  setAuthData: (
    id: number,
    token: string,
    userType: string,
    username: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<number | null>(
    () => Number(localStorage.getItem("userId")) || null
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [userType, setUserType] = useState<string | null>(
    localStorage.getItem("userType") || null
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username") || null
  );

  const setAuthData = (
    id: number,
    token: string,
    userType: string,
    username: string
  ) => {
    setUserId(id);
    setToken(token);
    setUserType(userType);
    setUsername(username);

    localStorage.setItem("userId", String(id));
    localStorage.setItem("token", token);
    localStorage.setItem("userType", userType);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setUserId(null);
    setToken(null);
    setUserType(null);
    setUsername(null);

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider
      value={{ userId, token, userType, username, setAuthData, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
