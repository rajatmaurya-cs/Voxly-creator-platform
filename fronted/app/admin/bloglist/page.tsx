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
  UserRound
} from "lucide-react";

const Page = () => {

  const [deletingBlog, setdeletingBlog] = useState<string | null>(null);

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
        queryKey: ["blogs"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.message || "Failed to update blog status",
        {
          id: "toggle",
        }
      );
    },
  });


  const handletoggle = (blogId: string) => {

    console.log("Entered in handletoggle")

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

  onMutate: () => {
    toast.loading("Deleting blog...", {
      id: "delete",
    });
  },

  onSuccess: (data) => {
    toast.success(data.message || "Deleted!", {
      id: "delete",
    });

    queryClient.invalidateQueries({
      queryKey: ["blogs"],
    });
  },

  onError: (err: any) => {
    toast.error(
      err?.message || "Failed to delete blog",
      {
        id: "delete",
      }
    );
  },
});

const handledelete = (blogId:string)=>{
deleteMutation.mutate(blogId)
}


  if (isLoading) {
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
        <div className='rounded-3xl border border-zinc-800 bg-zinc-900/80 px-8 py-6 shadow-2xl backdrop-blur-xl'>
          <h1 className='animate-pulse text-lg font-medium text-zinc-400'>
            Loading blogs...
          </h1>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4'>
        <div className='w-full max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center backdrop-blur-xl'>
          <h1 className='text-lg font-semibold text-red-400'>
            {(error as Error)?.message}
          </h1>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0a0a0a] text-white px-4 py-10'>

      <div className='max-w-6xl mx-auto'>

        {/* HEADER */}
        <div className='mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>

          <div>
            <h1 className='text-4xl font-black tracking-tight'>
              Publications
            </h1>

            <p className='mt-2 text-sm text-zinc-500'>
              Manage published and draft blogs with moderation controls
            </p>
          </div>



        </div>

        {/* BLOGS */}
        <div className='space-y-7'>

          {blogs.map((blog) => {
            return (
              <div
                key={blog._id}
                className='group relative overflow-hidden rounded-[30px] border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-7 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-black/50'
              >

                {/* TOP STATUS BAR */}
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${blog.isPublished
                      ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
                      : "bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500"
                    }`}
                />

                {/* HOVER GLOW */}
                <div className='absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100'>
                  <div className='absolute -left-10 top-0 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl' />

                  <div className='absolute bottom-0 right-0 h-40 w-40 rounded-full bg-purple-500/10 blur-3xl' />
                </div>

                <div className='relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>

                  {/* LEFT */}
                  <div className='flex-1'>

                    {/* STATUS */}
                    <div className='mb-4 flex flex-wrap items-center gap-3'>

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-[0.15em]
                        ${blog.isPublished
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                          }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${blog.isPublished
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                            }`}
                        />

                        {blog.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>

                    </div>

                    {/* TITLE */}
                    <h2 className='mb-3 text-3xl font-black tracking-tight text-white transition-colors duration-300 group-hover:text-blue-400'>
                      {blog.title}
                    </h2>

                    {/* SUBTITLE */}
                    <p className='max-w-3xl text-sm leading-relaxed text-zinc-400'>
                      {blog.subTitle}
                    </p>

                    {/* META */}
                    <div className='mt-6 flex flex-wrap items-center gap-6'>

                      {/* DATE */}
                      <div className='flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-3 py-2'>

                        <CalendarDays className='h-4 w-4 text-zinc-500' />

                        <span className='text-sm font-medium text-zinc-300'>
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

                      {/* MODERATOR */}
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

                  {/* BUTTONS */}
                  <div className='flex items-center gap-3'>

                    <button
                      disabled={
                        toggleMutation.isPending &&
                        deletingBlog === blog._id
                      }
                      onClick={() => handletoggle(blog._id)}
                      className={`group/button relative overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${blog.isPublished
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

                    <button onClick={()=>handledelete(blog._id)}
                      className='rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-600 hover:to-rose-700 active:scale-95'
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            )
          })}

        </div>

        {/* LOAD MORE */}
        {hasNextPage && (
          <div className='mt-12 flex justify-center'>

            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className='group relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 px-7 py-3 font-semibold text-white shadow-xl transition-all duration-300 hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-50'
            >

              <span className='relative z-10'>
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </span>

            </button>

          </div>
        )}

      </div>
    </div>
  )
}

export default Page