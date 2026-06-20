'use client'

import { useMemo, useState } from 'react';
import { usePublication } from '../../hooks/usePublication'
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BlogPublicationsSkeleton } from './blog-loading';
import {
  CalendarDays,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  UserRound,
  Trash2,
  Layers,
  ArrowDown,
  ChevronDown
} from "lucide-react";
import { apiFetch } from '@/lib/apiFetch';

const Page = () => {
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [togglingBlogId, setTogglingBlogId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const LIMIT: number = 2; 

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePublication({
    category: "All",
    limit: LIMIT,
    isAdmin: true
  });

  const blogs = useMemo(() => {
    return data?.pages?.flatMap((p) => p.blogs) ?? [];
  }, [data]);

  const toggleMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await apiFetch(
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
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update blog");
      }
      return data;
    },
    onMutate: (blogId) => {
      setTogglingBlogId(blogId);
      toast.loading("Updating status...", { id: "toggle" });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Status updated", { id: "toggle" });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update status", { id: "toggle" });
    },
    onSettled: () => {
      setTogglingBlogId(null);
    }
  });

  const handletoggle = (blogId: string) => {
    toggleMutation.mutate(blogId);
  }

  const deleteMutation = useMutation({
    mutationFn: async (blogId: string) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/delete-blog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ blogId }),
        }
      );

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to delete blog");
      }
      return data;
    },
    onMutate: (blogId) => {
      setDeletingBlogId(blogId);
      toast.loading("Deleting compilation...", { id: "delete" });
    },
    onSuccess: (data) => {
      toast.success(data.message || "Deleted successfully", { id: "delete" });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete blog", { id: "delete" });
    },
    onSettled: () => {
      setDeletingBlogId(null);
    }
  });

  const handledelete = (blogId: string) => {
    if (confirm("Are you sure you want to delete this publication?")) {
      deleteMutation.mutate(blogId);
    }
  }

  if (isLoading) {
    return <BlogPublicationsSkeleton />;
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-[#09090b] flex items-center justify-center px-4 font-sans antialiased'>
        <div className='w-full max-w-md rounded-xl border border-red-950/60 bg-red-950/10 p-5 backdrop-blur-md'>
          <p className='text-sm font-medium text-red-400 text-center tracking-tight'>
            {(error as Error)?.message || "An error occurred while loading content."}
          </p>
        </div>
      </div>
    )
  }

  return (
  <div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6] px-6 py-12 font-sans antialiased selection:bg-[#1d2430] selection:text-white">
  <div className="max-w-5xl mx-auto">

    {}
    <div className="mb-10 flex flex-col gap-4 border-b border-[#1b1f27] pb-8 sm:flex-row sm:items-center sm:justify-between">
      
      <div>
        <div className="mb-2 flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
          <Layers className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>Admin Control Panel</span>
        </div>

        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
          Publications Hub
        </h1>

        <p className="mt-2 max-w-xl text-sm leading-7 text-[#8b90a0]">
          Review, moderate, status toggle, and manage live content deployments instantly.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-[#222733] bg-[#171b22] px-4 py-2 text-xs font-medium text-[#c2c8d3] shadow-inner self-start sm:self-center">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{blogs.length} Total Logs</span>
      </div>
    </div>

    {}
    <div className="space-y-4">
      {blogs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#222733] bg-[#11141a] py-16 text-center">
          <p className="text-sm text-[#7c8393]">
            No available publications found in this directory.
          </p>
        </div>
      ) : (
        blogs.map((blog) => {
          const isToggling = togglingBlogId === blog._id;
          const isDeleting = deletingBlogId === blog._id;
          const isDisabled = isToggling || isDeleting;

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

              {}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />

              {}
              <div className="relative min-w-0 flex-1 space-y-3.5">

                {}
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
                      ? "Active"
                      : "Draft Workspace"}
                  </span>
                </div>

                {}
                <div className="space-y-1">
                  <h2 className="break-words text-lg font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-white">
                    {blog.title}
                  </h2>

                  {blog.subTitle && (
                    <p className="truncate-3-lines max-w-3xl text-sm leading-relaxed text-[#8b90a0]">
                      {blog.subTitle}
                    </p>
                  )}
                </div>

                {}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs font-medium text-[#7c8393]">

                  {}
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

                  {}
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#2a313d] bg-[#171b22] text-[#c2c8d3]">
                      <UserRound className="h-2.5 w-2.5" />
                    </div>

                    <span className="text-[#8b90a0]">
                      {blog.moderatedBy?.fullName || "System Engine"}
                    </span>

                    <ShieldCheck className="h-3.5 w-3.5 text-[#6b7280]" />
                  </div>
                </div>
              </div>

              {}
              <div className="flex shrink-0 items-center gap-2 border-t border-[#1b1f27] pt-4 md:border-t-0 md:pt-0 sm:self-end md:self-start lg:self-center">

                {}
                <button
                  disabled={isDisabled}
                  onClick={() => handletoggle(blog._id)}
                  className={`h-9 inline-flex items-center justify-center gap-2 rounded-lg border px-4 text-xs font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                    blog.isPublished
                      ? `
                        border-[#2a313d]
                        bg-[#171b22]
                        text-[#d1d5db]
                        hover:border-[#364152]
                        hover:bg-[#1d2430]
                      `
                      : `
                        border-transparent
                        bg-[#f3f4f6]
                        text-[#0f1115]
                        hover:bg-white
                      `
                  }`}
                >
                  {isToggling ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Syncing...</span>
                    </>
                  ) : blog.isPublished ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5 stroke-[2]" />
                      <span>Unpublish</span>
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5 stroke-[2]" />
                      <span>Publish Logs</span>
                    </>
                  )}
                </button>

                {}
                <button
                  onClick={() => handledelete(blog._id)}
                  disabled={isDisabled}
                  className="
                    h-9
                    w-9
                    inline-flex
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-[#222733]
                    bg-[#171b22]
                    text-[#7c8393]
                    transition-all
                    duration-200
                    hover:border-red-500/20
                    hover:bg-red-500/10
                    hover:text-red-400
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                  aria-label="Delete blog compilation"
                >
                  {isDeleting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                  )}
                </button>

              </div>
            </div>
          );
        })
      )}
    </div>

    {}
    {hasNextPage && (
      <div className="mt-8 flex justify-center border-t border-[#1b1f27] pt-8">

        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="
            h-10
            inline-flex
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#222733]
            bg-[#171b22]
            px-5
            text-xs
            font-medium
            tracking-tight
            text-[#c2c8d3]
            transition-all
            duration-200
            hover:border-[#364152]
            hover:bg-[#1d2430]
            disabled:opacity-40
          "
        >
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Loading updates...</span>
            </div>
          ) : (
            <>
              <span>See More</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>

      </div>
    )}

  </div>
</div>
  )
}

export default Page