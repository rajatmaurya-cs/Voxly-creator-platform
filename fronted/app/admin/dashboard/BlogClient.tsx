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
  FileText,
  Layers,
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
      toast.loading("Updating visibility status...", {
        id: "toggle",
      });
    },

    onSuccess: (data) => {
      toast.success(data.message || "Status updated", {
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
      toast.error(err?.message || "Failed to update status", {
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
      <div className="flex h-[75vh] items-center justify-center bg-zinc-950 font-sans antialiased">
        <div className="flex items-center gap-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-5 py-3.5 backdrop-blur-md">
          <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          <span className="text-sm font-medium text-zinc-400 tracking-tight">
            Syncing registry...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-zinc-950 px-4 font-sans antialiased">
        <div className="w-full max-w-md rounded-xl border border-red-950/40 bg-red-950/10 p-5 backdrop-blur-md">
          <p className="text-sm font-medium text-red-400 text-center tracking-tight">
            {(error as Error).message || "An unexpected system error occurred."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-12 text-zinc-200 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100">
      <div className="mx-auto max-w-5xl">
        
        {/* CONTROL HUB HEADER */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-zinc-500 mb-1.5 text-[11px] font-semibold tracking-widest uppercase">
              <Layers className="w-3.5 h-3.5 stroke-[2]" />
              <span>Admin Workspace</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-zinc-100 sm:text-3xl">
              Blog Publications
            </h1>
            <p className="mt-1.5 text-sm font-normal text-zinc-400 max-w-xl leading-relaxed">
              Audit index architecture, modify visibility flags, and supervise deployment lifecycles.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-zinc-900/30 border border-zinc-800/60 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 self-start sm:self-center">
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>{latestBlogs.length} Records Loaded</span>
          </div>
        </div>

        {/* COMPACT DATA LIST */}
        <div className="space-y-3">
          {latestBlogs.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-zinc-900 rounded-xl bg-zinc-900/5">
              <p className="text-sm text-zinc-500 tracking-tight">No modern entries found in this sequence.</p>
            </div>
          ) : (
            latestBlogs.map((blog: Blog) => {
              const isUpdating = toggleMutation.isPending && deletingBlog === blog._id;

              return (
                <div
                  key={blog._id}
                  className="group relative rounded-xl border border-zinc-900 bg-zinc-900/10 p-5 transition-all duration-200 hover:bg-zinc-900/30 hover:border-zinc-800/80 flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  {/* METADATA & CORE CONTENT BLOCK */}
                  <div className="flex-1 space-y-3 min-w-0">
                    
                    {/* STATUS INDICATORS */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase border ${
                          blog.isPublished
                            ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
                            : "border-zinc-800 bg-zinc-800/40 text-zinc-400"
                        }`}
                      >
                        <span className={`h-1 w-1 rounded-full ${blog.isPublished ? "bg-emerald-400" : "bg-zinc-500"}`} />
                        {blog.isPublished ? "Active Deployment" : "Draft Terminal"}
                      </span>
                    </div>

                    {/* TEXT WRAPPERS */}
                    <div className="space-y-1.5">
                      <h2 className="text-base font-medium text-zinc-100 tracking-tight transition-colors duration-150 group-hover:text-white break-words">
                        {blog.title}
                      </h2>
                      {blog.subTitle && (
                        <p className="text-sm font-normal text-zinc-400 max-w-3xl leading-relaxed line-clamp-2">
                          {blog.subTitle}
                        </p>
                      )}
                    </div>

                    {/* PLATFORM INLINE META DATA */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-zinc-500 font-medium">
                      
                      {/* DATE FIELD */}
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-600" />
                        <span>
                          {blog.createdAt
                            ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </span>
                      </div>

                      <span className="text-zinc-800 hidden sm:inline">•</span>

                      {/* MODERATION PROFILE */}
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400">
                          <UserRound className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-zinc-400">
                          {blog.moderatedBy?.fullName || "Core Engine"}
                        </span>
                        <ShieldCheck className="h-3.5 w-3.5 text-zinc-600" />
                      </div>
                    </div>
                  </div>

                  {/* MINIMAL CONTROL ACTIONS */}
                  <div className="flex items-center shrink-0 border-t border-zinc-900/60 md:border-t-0 pt-4 md:pt-0 self-start sm:self-end md:self-center">
                    <button
                      disabled={isUpdating}
                      onClick={() => handletoggle(blog._id)}
                      className={`h-8 inline-flex items-center justify-center gap-2 rounded-lg px-3.5 text-xs font-medium tracking-tight transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border ${
                        blog.isPublished
                          ? "bg-zinc-900 border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200"
                          : "bg-zinc-100 border-transparent text-zinc-950 hover:bg-zinc-200"
                      }`}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : blog.isPublished ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 stroke-[1.8]" />
                          <span>Unpublish Entry</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 stroke-[1.8]" />
                          <span>Push Live</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* LIVE STREAM PROCESSOR SYSTEM FOOTER */}
        {isFetching && !isLoading && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-zinc-900/80 bg-zinc-900/10 px-4 py-1.5 backdrop-blur-md">
              <Loader2 className="h-3 w-3 animate-spin text-zinc-500" />
              <span className="text-[11px] font-medium tracking-tight text-zinc-500">
                Refreshing document index...
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogClient;