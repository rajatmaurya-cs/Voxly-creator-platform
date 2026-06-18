"use client";

import {
  createContext,
  useState,
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
  // These local states are only used when login/logout happens manually
  // (i.e., not via the query). The query is the source of truth.
  const [manualUser, setManualUser] = useState<User | null>(null);
  const [manualLoggedIn, setManualLoggedIn] = useState<boolean | null>(null);

  // ---------------- QUERY ----------------
  const { data, isLoading, refetch, isError } = useQuery<User>({
    queryKey: ["auth-user"],
    queryFn: async () => {
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

  // When the query resolves successfully, sync to manual state and clear overrides
  useEffect(() => {
    if (data) {
      setManualUser(data);
      setManualLoggedIn(true);
    }
    if (isError) {
      setManualUser(null);
      setManualLoggedIn(false);
    }
  }, [data, isError]);

  // Derive final values:
  // - During initial load (isLoading=true, no cached data yet): show loading
  // - Once we have data OR an error, use the resolved values
  // - manualLoggedIn allows login/logout to update state instantly without waiting for a refetch
  const resolvedUser = manualUser;
  const resolvedLoggedIn = manualLoggedIn ?? false;

  // authloading is true ONLY when we have no resolved value yet (first load, no cache)
  const authloading = isLoading && manualLoggedIn === null;

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        loggedIn: resolvedLoggedIn,
        setUser: setManualUser,
        setLoggedIn: setManualLoggedIn as (v: boolean) => void,
        authloading,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------------- HOOK ----------------

