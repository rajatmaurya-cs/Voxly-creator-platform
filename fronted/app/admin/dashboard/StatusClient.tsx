"use client";

import { useQuery } from "@tanstack/react-query";

import {
  FileText,
  MessageSquare,
  FileClock,
} from "lucide-react";

const StatusClient = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard-data"],

    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/BlogDashboard`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const json = await res.json();

      if (!json.success) {
        throw new Error(
          json.message || "Failed to load dashboard data"
        );
      }

      const {
        totalBlogs,
        totalComments,
        draftBlogs,
      } = json.stats;

      return {
        totalBlogs,
        totalComments,
        draftBlogs,
      };
    },

    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="animate-pulse rounded-[28px] border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="h-4 w-32 rounded bg-zinc-800" />

            <div className="mt-6 h-10 w-24 rounded bg-zinc-700" />
          </div>
        ))}

      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
        <h1 className="text-lg font-semibold text-red-400">
          {(error as Error).message}
        </h1>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Blogs",
      value: data?.totalBlogs,
      icon: FileText,
      iconColor: "text-blue-400",
      glow: "from-blue-500/20 to-cyan-500/5",
      border: "border-blue-500/10",
      width: "85%",
    },

    {
      title: "Total Comments",
      value: data?.totalComments,
      icon: MessageSquare,
      iconColor: "text-emerald-400",
      glow: "from-emerald-500/20 to-green-500/5",
      border: "border-emerald-500/10",
      width: "70%",
    },

    {
      title: "Draft Blogs",
      value: data?.draftBlogs,
      icon: FileClock,
      iconColor: "text-red-400",
      glow: "from-red-500/20 to-rose-500/5",
      border: "border-red-500/10",
      width: "45%",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 ml-6">

      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`group relative overflow-hidden rounded-[30px] border bg-gradient-to-b ${item.glow} ${item.border} bg-zinc-900/90 p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-black/50`}
          >

            {/* HOVER GLOW */}
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
            </div>

            <div className="relative z-10">

              {/* TOP */}
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium tracking-wide text-zinc-500">
                    {item.title}
                  </p>

                  <h1 className="mt-4 text-5xl font-black tracking-tight text-white">
                    {item.value}
                  </h1>
                </div>

                {/* ICON */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
                  <Icon className={`h-7 w-7 ${item.iconColor}`} />
                </div>

              </div>

            

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusClient;