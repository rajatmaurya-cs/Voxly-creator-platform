"use client";

import {
  createContext,
  useState,
  useContext,
  useCallback,
} from "react";

// ---------------- TYPE ----------------

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
  setLoggedIn: (value: boolean) => void;
  user: User | null;
  refreshAccessToken: () => Promise<boolean>;
};

// ---------------- CONTEXT ----------------

export const AuthContext = createContext<AuthContextType | null>(null);

let refreshPromiseRef: Promise<boolean> | null = null;

// ---------------- PROVIDER ----------------

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (refreshPromiseRef) return refreshPromiseRef;

    refreshPromiseRef = (async (): Promise<boolean> => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refreshtoken`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data: { user?: User } = await res.json();

        if (res.ok && data.user) {
          setUser(data.user);
          setLoggedIn(true);
          return true;
        }

        setUser(null);
        setLoggedIn(false);
        return false;

      } finally {
        refreshPromiseRef = null;
      }
    })();

    return refreshPromiseRef;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        user,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}