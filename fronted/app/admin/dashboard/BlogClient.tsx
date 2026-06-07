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
import { apiFetch } from "@/lib/apiFetch";

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
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/toggle-blog`,
        {
          method: "POST",
          credentials: "include",
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
<div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6] antialiased selection:bg-[#1d2430] selection:text-white">
  <div className="mx-auto max-w-5xl px-6 py-12">

    {/* CONTROL HUB HEADER */}
    <div className="mb-10 flex flex-col gap-4 border-b border-[#1b1f27] pb-8 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <div className="mb-2 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
          <Layers className="h-3.5 w-3.5 stroke-[2]" />
          <span>Admin Workspace</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          Blog Publications
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-7 text-[#8b90a0]">
          Audit index architecture, modify visibility flags, and supervise deployment lifecycles.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-[#222733] bg-[#171b22] px-4 py-2 text-xs font-medium text-[#c2c8d3] shadow-inner self-start sm:self-center">
        <FileText className="h-4 w-4 text-[#7c8393]" />
        <span>{latestBlogs.length} Records Loaded</span>
      </div>
    </div>

    {/* COMPACT DATA LIST */}
    <div className="space-y-4">
      {latestBlogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#222733] bg-[#11141a] py-16 text-center">
          <p className="text-sm text-[#7c8393]">
            No modern entries found in this sequence.
          </p>
        </div>
      ) : (
        latestBlogs.map((blog: Blog) => {
          const isUpdating =
            toggleMutation.isPending && deletingBlog === blog._id;

          return (
            <div
              key={blog._id}
              className="
                group
                relative
                overflow-hidden
                rounded-xl
                border
                border-[#1b1f27]
                bg-[#11141a]
                p-5
                transition-all
                duration-300
                hover:border-[#2b3442]
                hover:bg-[#131821]
                flex
                flex-col
                justify-between
                gap-6
                md:flex-row
                md:items-start
              "
            >

              {/* subtle hover glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />

              <div className="relative flex-1 min-w-0 space-y-3.5">

                {/* STATUS INDICATORS */}
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      blog.isPublished
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-[#2a313d] bg-[#171b22] text-[#8b90a0]"
                    }`}
                  >
                    <span
                      className={`h-1 w-1 rounded-full ${
                        blog.isPublished
                          ? "bg-emerald-400"
                          : "bg-[#6b7280]"
                      }`}
                    />

                    {blog.isPublished
                      ? "Active Deployment"
                      : "Draft Terminal"}
                  </span>
                </div>

                {/* TEXT WRAPPERS */}
                <div className="space-y-1">
                  <h2 className="break-words text-lg font-medium tracking-tight text-white transition-colors duration-200">
                    {blog.title}
                  </h2>

                  {blog.subTitle && (
                    <p className="max-w-3xl text-sm leading-relaxed text-[#8b90a0] line-clamp-2">
                      {blog.subTitle}
                    </p>
                  )}
                </div>

                {/* PLATFORM INLINE META DATA */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-medium text-[#7c8393]">

                  {/* DATE FIELD */}
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-[#6b7280]" />

                    <span>
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

                  <span className="hidden text-[#2a313d] sm:inline">•</span>

                  {/* MODERATION PROFILE */}
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2a313d] bg-[#171b22] text-[#c2c8d3]">
                      <UserRound className="h-2.5 w-2.5" />
                    </div>

                    <span className="text-[#8b90a0]">
                      {blog.moderatedBy?.fullName || "Core Engine"}
                    </span>

                    <ShieldCheck className="h-3.5 w-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex shrink-0 items-center border-t border-[#1b1f27] pt-4 md:border-t-0 md:pt-0">

                <button
                  disabled={isUpdating}
                  onClick={() => handletoggle(blog._id)}
                  className={`
                    h-9
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    px-4
                    text-xs
                    font-medium
                    tracking-tight
                    transition-all
                    duration-200
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    ${
                      blog.isPublished
                        ? `
                          border border-[#2a313d]
                          bg-[#171b22]
                          text-[#d1d5db]
                          hover:border-[#364152]
                          hover:bg-[#1d2430]
                        `
                        : `
                          border border-transparent
                          bg-[#f3f4f6]
                          text-[#0f1115]
                          hover:bg-white
                        `
                    }
                  `}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : blog.isPublished ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 stroke-[1.9]" />
                      <span>Unpublish Entry</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 stroke-[1.9]" />
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

    {/* FOOTER */}
    {isFetching && !isLoading && (
      <div className="mt-8 flex justify-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-[#222733] bg-[#11141a] px-4 py-2 shadow-lg">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#8b90a0]" />

          <span className="text-xs font-medium tracking-tight text-[#8b90a0]">
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