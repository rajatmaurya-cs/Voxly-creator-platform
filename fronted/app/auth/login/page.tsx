"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { AuthContext } from "@/app/ContextProvider/AuthProvider";





// ---------------- TYPES ----------------

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "ADMIN" | "USER";
  createdAt: string;
};

type LoginResponse = {
  success: boolean;
  user: User;
};

// ---------------- COMPONENT ----------------

export default function LoginPage() {

  const {loggedIn , setLoggedIn} = useContext(AuthContext)

  const router = useRouter();


  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // ---------------- LOGIN API ----------------

 const loginMutation = useMutation<LoginResponse,Error,{ email: string; password: string }>({
  
  mutationFn: async ({ email, password }) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data: LoginResponse = await res.json();

    if (!res.ok || !data?.success) {
      throw new Error("Login failed");
    }

    return data;
  },

  onSuccess: (data) => {

    setLoggedIn(true)

    toast.success("Login successful");

    if (data.user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  },

  onError: (err) => {
    toast.error(err.message || "Something went wrong");
  },
});

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const isLoading = loginMutation.isPending

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafbfc] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">

        <h1 className="text-2xl font-bold text-center mb-6">
          Login to Postify
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-xl"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p
          onClick={() => router.push("/auth/forgot-password")}
          className="text-sm text-blue-600 mt-4 text-right cursor-pointer"
        >
          Forgot Password?
        </p>

        <p className="text-center mt-6 text-sm">
          New user?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-blue-600 cursor-pointer"
          >
            Create account
          </span>
        </p>

      </div>
    </div>
  );
}