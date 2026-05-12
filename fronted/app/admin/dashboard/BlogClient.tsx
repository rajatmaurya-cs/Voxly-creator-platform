"use client";

import { useState } from "react";
import { useDashboardblogs } from "../../hooks/useDashboardblogs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  CalendarDays,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

type ModeratedBy = {
  _id: string;
  fullName: string;
};

type Blog = {
  _id: string;
  title: string;
  subTitle: string;
  createdAt: string;
  isPublished: boolean;
  moderatedBy: ModeratedBy | null;
};

const BlogClient = () => {
  const [deletingBlog, setdeletingBlog] = useState<string | null>(null);

  const LIMIT: number = 5;

  const queryClient = useQueryClient();

  const {
    data: latestBlogs = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useDashboardblogs({
    limit: LIMIT,
    isAdmin: true,
    category: "All",
  });

  const toggleMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/toggle-blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId }),
        }
      );

      const data = await res.json();

      if (!data?.success) {
        throw new Error(data?.message || "Failed to update blog");
      }

      return data;
    },

    onMutate: () => {
      toast.loading("Updating blog status...", {
        id: "toggle",
      });
    },

    onSuccess: (data) => {
      toast.success(data.message || "Updated!", {
        id: "toggle",
      });

      queryClient.invalidateQueries({
        queryKey: ["latest-blogs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-stats"],
      });
    },

    onError: (err: any) => {
      toast.error(err?.message || "Failed to update blog status", {
        id: "toggle",
      });
    },
  });

  const handletoggle = (id: string) => {
    setdeletingBlog(id);

    toggleMutation.mutate(id, {
      onSettled: () => {
        setdeletingBlog(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center bg-[#050505]">
        <div className="flex items-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/80 px-8 py-5 shadow-2xl backdrop-blur-xl">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />

          <h1 className="text-lg font-semibold text-zinc-300">
            Loading Blogs...
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#050505] px-4">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-2xl backdrop-blur-xl">
          <h1 className="text-lg font-bold text-red-400">
            {(error as Error).message || "Something went wrong"}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-5 rounded-[32px] border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-8 shadow-[0px_0px_80px_rgba(59,130,246,0.08)] lg:flex-row lg:items-center lg:justify-between">

          <div>
          

            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Blog Dashboard
              
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-base">
              Manage your publications, moderation status and visibility with a
              premium admin experience.
            </p>
          </div>

         
        </div>

        {/* BLOG LIST */}
        <div className="space-y-6">
          {latestBlogs.map((blog: Blog) => (
            <div
              key={blog._id}
              className="group relative overflow-hidden rounded-[30px] border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-7 transition-all duration-500 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-[0px_0px_60px_rgba(59,130,246,0.08)]"
            >

              {/* TOP BAR */}
              <div
                className={`absolute left-0 top-0 h-1 w-full ${
                  blog.isPublished
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-400 via-rose-500 to-red-600"
                }`}
              />

              {/* BACKGROUND GLOW */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div className="absolute left-0 top-0 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-52 w-52 rounded-full bg-purple-500/10 blur-3xl" />
              </div>

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                {/* LEFT SIDE */}
                <div className="flex-1">

                  {/* BADGES */}
                  <div className="mb-5 flex flex-wrap items-center gap-3">

                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wide ${
                        blog.isPublished
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {blog.isPublished ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}

                      {blog.isPublished ? "Published" : "Draft"}
                    </div>

                   
                  </div>

                  {/* TITLE */}
                  <h1 className="mb-3 text-2xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-blue-400 md:text-3xl">
                    {blog.title}
                  </h1>

                  {/* SUBTITLE */}
                  <p className="max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                    {blog.subTitle}
                  </p>

                  {/* META */}
                  <div className="mt-6 flex flex-wrap items-center gap-6">

                    <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2">
                      <CalendarDays className="h-4 w-4 text-blue-400" />

                      <span className="text-sm font-medium text-zinc-300">
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "—"}
                      </span>
                    </div>

                    

                       <div className='flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2'>

                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white shadow-lg'>
                         <UserRound/>
                        </div>

                        <div className='flex flex-col leading-tight'>
                          <span className='text-[11px] uppercase tracking-wider text-zinc-500'>
                            Moderated By
                          </span>

                          <span className='text-sm font-semibold text-zinc-200 break-words'>
                            {blog.moderatedBy?.fullName || "System"}
                          </span>
                        </div>

                        <ShieldCheck className='h-4 w-4 text-emerald-400' />

                      </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center">

                  <button
                    disabled={
                      toggleMutation.isPending &&
                      deletingBlog === blog._id
                    }
                    onClick={() => handletoggle(blog._id)}
                    className={`group/button relative overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                      blog.isPublished
                        ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                        : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    }`}
                  >

                    <span className="relative z-10 flex items-center gap-2">

                      {toggleMutation.isPending &&
                      deletingBlog === blog._id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : blog.isPublished ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          Publish
                        </>
                      )}
                    </span>

                    <div className="absolute inset-0 translate-y-full bg-white/10 transition-transform duration-300 group-hover/button:translate-y-0" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FETCHING */}
        {isFetching && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-6 py-3 shadow-xl backdrop-blur-xl">
              <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

              <span className="text-sm font-medium text-zinc-400">
                Refreshing blogs...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogClient;