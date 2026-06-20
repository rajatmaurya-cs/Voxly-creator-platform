"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { AuthContext } from "@/app/ContextProvider/AuthProvider";

const Page = () => {
  
  const { user } = useContext(AuthContext) as any;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-zinc-900 px-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-xl p-8 shadow-2xl">

        {}
        <div className="flex justify-center mb-6">
          <div className="relative h-32 w-32 rounded-full ring-4 ring-white ring-offset-4 ring-offset-zinc-900 overflow-hidden">
            <Image
              src={user?.avatar || "/default-avatar.png"}
              alt={user?.name || "Profile"}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            {user?.name}
          </h1>

          <p className="text-zinc-400 mt-2">
            {user?.email}
          </p>

          <div className="mt-4 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800 px-4 py-1 text-sm font-medium text-zinc-200">
            {user?.role}
          </div>
        </div>

        {}
        <div className="my-8 border-t border-zinc-800" />

        {}
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-zinc-500">User ID</span>
            <span className="text-zinc-200 text-sm">
              {user?.id}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-zinc-500">Joined</span>
            <span className="text-zinc-200">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;