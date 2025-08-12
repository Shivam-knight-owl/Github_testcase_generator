import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

type User = { id: string; username: string; email?: string } | null;

const AuthContext = createContext<{ user: User; loading: boolean; refreshUser: () => Promise<void> }>({
  user: null,
  loading: true,
  refreshUser: async () => {}
});

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      setLoading(true);
      const res = await api.get("/auth/user");
      const data = res.data as { user: User };
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, refreshUser } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);//custom hook
