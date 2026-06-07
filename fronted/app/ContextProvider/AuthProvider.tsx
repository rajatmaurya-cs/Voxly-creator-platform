"use client";

import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { apiFetch } from "@/lib/apiFetch";

// ---------------- TYPES ----------------

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

type AuthContextType = {
  loggedIn: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setLoggedIn: (v: boolean) => void;
  loading: boolean;
};

// ---------------- CONTEXT ----------------

export const AuthContext = createContext<AuthContextType | null>(null);

// ---------------- PROVIDER ----------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializedRef = useRef(false);

  // ---------------- GET USER ----------------
  const getUser = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);

      if (!res.ok) {
        setUser(null);
        setLoggedIn(false);
        return;
      }

      const data = await res.json();

      if (data?.success) {
        setUser(data.user);
        setLoggedIn(true);
      } else {
        setUser(null);
        setLoggedIn(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // ---------------- INIT ----------------
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        setUser,
        setLoggedIn,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- HOOK ----------------

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};