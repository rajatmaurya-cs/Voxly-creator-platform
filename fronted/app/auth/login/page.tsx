"use client";

import { useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Link from "next/link";
import { AuthContext } from "@/app/ContextProvider/AuthProvider";
import EditorLoader from "@/app/Animations/EditorLoader";


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



export default function LoginPage() {

  const { setLoggedIn, setUser } = useContext(AuthContext) as any;

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string }
  >({

    mutationFn: async ({ email, password }) => {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data: LoginResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error("Invalid email or password");
      }

      return data;
    },

    onSuccess: (data) => {


      setLoggedIn(true);

      setUser(data.user);

      toast.success("Login successful");

      router.replace("/");

    },

    onError: (err) => {

      toast.error(err.message || "Something went wrong");

    },
  });

  

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  };

  const isLoading = loginMutation.isPending;


  const handleGoogleLogin = () => {



    window.location.href = `/api/auth/google`;
  }

  

  return (

    <div className="min-h-screen bg-[#0b0d11] px-4 py-8 text-[#f3f4f6] antialiased selection:bg-[#1d2430] selection:text-white">

      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">

        <div
          className="
        relative
        w-full
        max-w-md
        overflow-hidden
        rounded-[32px]
        border
        border-[#1b1f27]
        bg-[#11141a]/95
        p-7
        sm:p-8
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-xl
      "
        >

          {}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_55%)]" />

          <div className="relative">

            {}

            <div className="mb-9">
              <div className="flex flex-col items-center gap-3">

                {}
                <div className="flex items-center ">
                  <div className="relative w-25 h-25 shrink-0">
                    <Image
                      src="/pixel.png"
                      alt="Veyra Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <span
                    className="text-3xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.18em" }}
                  >
                    Veyra
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#8b90a0]">
                  Welcome back
                </p>

              </div>
            </div>

            {}

            <form onSubmit={handleLogin} className="space-y-5">

              {}

              <div className="space-y-2">

                <label className="block text-sm font-medium text-[#c2c8d3]">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="
                h-13
                w-full
                rounded-2xl
                border
                border-[#222733]
                bg-[#171b22]
                px-4
                text-[15px]
                text-[#f3f4f6]
                outline-none
                transition-all
                duration-200
                placeholder:text-[#6b7280]
                focus:border-[#3a4252]
                focus:bg-[#1b2028]
              "
                />
              </div>

              {}

              <div className="space-y-2">

                <label className="block text-sm font-medium text-[#c2c8d3]">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="
                h-13
                w-full
                rounded-2xl
                border
                border-[#222733]
                bg-[#171b22]
                px-4
                text-[15px]
                text-[#f3f4f6]
                outline-none
                transition-all
                duration-200
                placeholder:text-[#6b7280]
                focus:border-[#3a4252]
                focus:bg-[#1b2028]
              "
                />
              </div>

              {}

              <div className="flex justify-end pt-1">

                <button
                  type="button"
                  onClick={() => router.push("/auth/forgotpassword")}
                  className="
                text-sm
                font-medium
                text-[#8b90a0]
                transition-colors
                duration-200
                hover:text-[#d1d5db]
              "
                >
                  Forgot Password?
                </button>

              </div>

              {}

              <button
                type="submit"
                disabled={isLoading}
                className={
                  isLoading
                    ? "flex h-13 w-full items-center justify-center bg-transparent border-none pointer-events-none"
                    : `
                      flex
                      h-13
                      w-full
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-transparent
                      bg-[#f3f4f6]
                      text-sm
                      font-semibold
                      text-[#0f1115]
                      transition-all
                      duration-200
                      hover:bg-white
                      active:scale-[0.99]
                    `
                }
              >
                {isLoading ? <EditorLoader size={40} border={2} /> : "Sign In"}
              </button>

            </form>

            {}

            <div className="relative my-8">

              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#222733]" />
              </div>

              <div className="relative flex justify-center">

                <span
                  className="
                rounded-full
                border
                border-[#222733]
                bg-[#11141a]
                px-4
                py-1
                text-[11px]
                font-semibold
                tracking-[0.22em]
                text-[#7c8393]
              "
                >
                  OR CONTINUE WITH
                </span>

              </div>
            </div>

            {}

            <button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="
            group
            relative
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-[#222733]
            bg-[#171b22]
            px-5
            py-4
            transition-all
            duration-300
            hover:border-[#364152]
            hover:bg-[#1d2430]
            active:scale-[0.99]
          "
            >

              <div
                className="
              absolute
              inset-0
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-100
              bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.03),transparent)]
            "
              />

              <div className="relative flex items-center justify-center gap-3">

                <div
                  className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-[#2f3541]
                bg-[#20252e]
              "
                >

                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />

                </div>

                <div className="flex flex-col items-start">

                  <span className="text-sm font-semibold text-[#e5e7eb]">
                    Continue with Google
                  </span>

                  <span className="text-xs text-[#7c8393]">
                    Fast & secure authentication
                  </span>

                </div>
              </div>
            </button>

            {}

            <p className="mt-8 text-center text-sm text-[#7c8393]">

              Don&apos;t have an account?{" "}

              <Link
                href={"/auth/createaccount"}
                onClick={() => router.push("/auth/signup")}
                className="
              font-semibold
              text-[#d1d5db]
              transition-colors
              duration-200
              hover:text-white
            "
              >
                Create account
              </Link>

            </p>

          </div>
        </div>
      </div>
    </div>
  );
}