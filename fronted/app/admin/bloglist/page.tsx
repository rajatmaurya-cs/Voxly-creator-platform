'use client'

import { useMemo, useState } from 'react';
import { usePublication } from '../../hooks/usePublication'
import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
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

const Page = () => {
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [togglingBlogId, setTogglingBlogId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const LIMIT: number = 2; // Increased limit for a more professional dashboard view

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
      const res = await fetch(
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
    return (
      <div className='min-h-screen bg-[#09090b] flex items-center justify-center font-sans antialiased selection:bg-zinc-800'>
        <div className='flex items-center gap-3 px-6 py-4 rounded-xl border border-zinc-800/80 bg-zinc-900/20 backdrop-blur-md'>
          <Loader2 className='h-4 w-4 animate-spin text-zinc-400' />
          <span className='text-sm font-medium text-zinc-400 tracking-tight'>Retrieving workspace publications...</span>
        </div>
      </div>
    )
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
    <div className='min-h-screen bg-[#09090b] text-zinc-200 px-6 py-12 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100'>
      <div className='max-w-5xl mx-auto'>

        {/* DASHBOARD HEADER */}
        <div className='mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-8 gap-4'>
          <div>
            <div className='flex items-center gap-2.5 text-zinc-500 mb-1.5 text-xs font-semibold tracking-widest uppercase'>
              <Layers className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Admin Control Panel</span>
            </div>
            <h1 className='text-2xl font-semibold tracking-tight text-zinc-100 sm:text-3xl'>
              Publications Hub
            </h1>
            <p className='mt-1.5 text-sm font-normal text-zinc-400 max-w-xl leading-relaxed'>
              Review, moderate, status toggle, and manage live content deployments instantly.
            </p>
          </div>
          <div className='flex items-center gap-2 bg-zinc-900/40 border border-zinc-800/60 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 self-start sm:self-center'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            <span>{blogs.length} Total Logs</span>
          </div>
        </div>

        {/* PUBLICATIONS LIST CONTAINER */}
        <div className='space-y-4'>
          {blogs.length === 0 ? (
            <div className='text-center py-16 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/10'>
              <p className='text-sm text-zinc-500'>No available publications found in this directory.</p>
            </div>
          ) : (
            blogs.map((blog) => {
              const isToggling = togglingBlogId === blog._id;
              const isDeleting = deletingBlogId === blog._id;
              const isDisabled = isToggling || isDeleting;

              return (
                <div
                  key={blog._id}
                  className='group relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/20 p-5 transition-all duration-200 hover:bg-zinc-900/40 hover:border-zinc-800/80 flex flex-col md:flex-row md:items-start justify-between gap-6'
                >
                  {/* WORKSPACE METADATA & CONTENT ROW */}
                  <div className='flex-1 space-y-3.5 min-w-0'>

                    {/* STATUS PILLS */}
                    <div className='flex items-center gap-2'>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase border ${blog.isPublished
                            ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
                            : "border-zinc-800 bg-zinc-800/40 text-zinc-400"
                          }`}
                      >
                        <span className={`h-1 w-1 rounded-full ${blog.isPublished ? "bg-emerald-400" : "bg-zinc-500"}`} />
                        {blog.isPublished ? "Active" : "Draft Workspace"}
                      </span>
                    </div>

                    {/* TEXT LOGS */}
                    <div className='space-y-1'>
                      <h2 className='text-lg font-medium text-zinc-100 tracking-tight transition-colors duration-150 group-hover:text-white break-words'>
                        {blog.title}
                      </h2>
                      {blog.subTitle && (
                        <p className='text-sm font-normal text-zinc-400 max-w-3xl leading-relaxed truncate-3-lines'>
                          {blog.subTitle}
                        </p>
                      )}
                    </div>

                    {/* METADATA PLATFORM BAR */}
                    <div className='flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-zinc-500 font-medium'>

                      {/* TIMESTAMP */}
                      <div className='flex items-center gap-1.5'>
                        <CalendarDays className='h-3.5 w-3.5 text-zinc-600' />
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

                      <span className='text-zinc-800 hidden sm:inline'>•</span>

                      {/* MODERATOR TAG */}
                      <div className='flex items-center gap-2'>
                        <div className='flex h-5 w-5 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-300'>
                          <UserRound className='h-2.5 w-2.5' />
                        </div>
                        <span className='text-zinc-400'>
                          {blog.moderatedBy?.fullName || "System Engine"}
                        </span>
                        <ShieldCheck className='h-3.5 w-3.5 text-zinc-600' />
                      </div>
                    </div>
                  </div>

                  {/* ACTION MODULE SYSTEM */}
                  <div className='flex items-center gap-2 sm:self-end md:self-start lg:self-center shrink-0 border-t border-zinc-900/60 md:border-t-0 pt-4 md:pt-0'>

                    {/* TOGGLE WORKSPACE STATUS STATUS */}
                    <button
                      disabled={isDisabled}
                      onClick={() => handletoggle(blog._id)}
                      className={`h-9 inline-flex items-center justify-center gap-2 rounded-lg px-4 text-xs font-medium tracking-tight transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border ${blog.isPublished
                          ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200"
                          : "bg-zinc-100 border-transparent text-zinc-950 hover:bg-zinc-200"
                        }`}
                    >
                      {isToggling ? (
                        <>
                          <Loader2 className='h-3.5 w-3.5 animate-spin' />
                          <span>Syncing...</span>
                        </>
                      ) : blog.isPublished ? (
                        <>
                          <EyeOff className='h-3.5 w-3.5 stroke-[2]' />
                          <span>Unpublish</span>
                        </>
                      ) : (
                        <>
                          <Eye className='h-3.5 w-3.5 stroke-[2]' />
                          <span>Publish Logs</span>
                        </>
                      )}
                    </button>

                    {/* DESTRUCTIVE DELETE TRASH */}
                    <button
                      onClick={() => handledelete(blog._id)}
                      disabled={isDisabled}
                      className='h-9 w-9 inline-flex items-center justify-center rounded-lg border border-zinc-900 bg-transparent text-zinc-500 transition-all duration-150 hover:border-red-950 hover:bg-red-950/20 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed'
                      aria-label='Delete blog compilation'
                    >
                      {isDeleting ? (
                        <Loader2 className='h-3.5 w-3.5 animate-spin' />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 stroke-[2]" />
                      )}
                    </button>

                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* PAGINATION MODULE BUTTON */}
        {hasNextPage && (
          <div className='mt-8 flex justify-center border-t border-zinc-900 pt-8'>
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="h-9 inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-transparent px-5 text-xs font-medium tracking-tight text-zinc-400 transition-all duration-150 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-40"
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