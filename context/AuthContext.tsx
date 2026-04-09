"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface User {
  id: string;
  username: string;
  avatar?: string;
  points: number;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isLoginModalOpen: boolean;
  /** Refreshes the user's Botrix points balance from the server */
  refreshPoints: () => Promise<void>;
  /** Replaces local points state after a successful redemption */
  setPoints: (points: number) => void;
  logout: () => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  /** Load session from server on mount */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {
        // Session fetch failed — treat as logged out
      })
      .finally(() => setIsLoading(false));
  }, []);

  const refreshPoints = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/points/balance");
      if (res.ok) {
        const data = await res.json();
        setUser((prev) => (prev ? { ...prev, points: data.points } : prev));
      }
    } catch {
      // Non-fatal
    }
  }, [user]);

  const setPoints = useCallback((points: number) => {
    setUser((prev) => (prev ? { ...prev, points } : prev));
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsLoginModalOpen(false);
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isLoginModalOpen,
        refreshPoints,
        setPoints,
        logout,
        openLoginModal,
        closeLoginModal,
      }}
    >
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
