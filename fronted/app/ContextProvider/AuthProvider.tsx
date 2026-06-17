"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { useQuery } from "@tanstack/react-query";
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
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoggedIn: (v: boolean) => void;
  authloading: boolean;
  refetchUser: () => void;
};

// ---------------- CONTEXT ----------------

export const AuthContext = createContext<AuthContextType | null>(null);

// ---------------- PROVIDER ----------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);


  // ---------------- QUERY ----------------
  const { data, isLoading, refetch, isError } = useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      console.log("Querying session state from URL:", `${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/me`
      );

      if (!res.ok) throw new Error("Not authenticated");

      const result = await res.json();
      return result.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // ---------------- SYNC STATE ----------------
  useEffect(() => {

    if (data) {
      setUser(data);
      setLoggedIn(true);
    }

    if (isError) {
      setUser(null);
      setLoggedIn(false);
    }


  }, [data, isError, isLoading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loggedIn,
        setUser,
        setLoggedIn,
        authloading: isLoading,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- HOOK ----------------

