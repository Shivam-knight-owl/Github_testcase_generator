import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

type User = { id: string; username: string; email?: string } | null;

const AuthContext = createContext<{ 
  user: User; 
  loading: boolean; 
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  clearUser: () => {}
});

export const AuthProvider: React.FC<{children:React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const clearUser = () => {
    setUser(null);
    // Clear cookies
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  async function refreshUser() {
    try {
      setLoading(true);
      const res = await api.get("/auth/user", { withCredentials: true });
      const data = res.data as { user: User };
      
      // Validate user data
      if (data.user && data.user.id && data.user.username) {
        setUser(data.user);
      } else {
        clearUser();
      }
    } catch (err: any) {
      console.log("Auth check failed:", err.response?.status);
      clearUser();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  // Listen for window focus to refresh auth after OAuth
  useEffect(() => {
    const handleFocus = () => {
      // Small delay to let any redirects settle
      setTimeout(() => {
        refreshUser();
      }, 100);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        handleFocus();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, refreshUser, clearUser } },
    children
  );
};

export const useAuth = () => useContext(AuthContext);//custom hook
