'use client'

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {  toast } from "sonner";
import { CommentModerationSkeleton } from "./comment-loading";
import Moment from "moment";
import { 
  MessageSquare, 
  Trash2, 
  Check, 
  X, 
  Loader2, 
  ShieldAlert, 
  Inbox,
  Filter
} from "lucide-react";
import { apiFetch } from "@/lib/apiFetch";

const Page = () => {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");
  const [togglingcomment, settogglingcomment] = useState("");

  const {
    data: allComments = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/comments`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load comments");
      }

      return data.comments || [];
    },
    staleTime: 20_000,
  });

  const comments = useMemo(() => {
    if (filter === "approved") return allComments.filter((c: any) => c.isApproved);
    if (filter === "pending") return allComments.filter((c: any) => !c.isApproved);
    return allComments;
  }, [allComments, filter]);

  const toggleMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/toggle-comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to update comment");
      }

      return data;
    },
    onMutate: () => {
      toast.loading("Updating comment...", {
        id: "toggle-comment",
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Status updated", {
        id: "toggle-comment",
      });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to update status", {
        id: "toggle-comment",
      });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/removecomment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ commentId }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to remove comment");
      }

      return data;
    },
    onMutate: () => {
      toast.loading("Removing comment...", {
        id: "remove-comment",
      });
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Removed successfully", {
        id: "remove-comment",
      });
      queryClient.invalidateQueries({
        queryKey: ["comments"],
      });
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to delete", {
        id: "remove-comment",
      });
    },
  });

  const disableAll = toggleMutation.isPending || removeMutation.isPending;

  const handleRemove = async (commentId: string) => {
    settogglingcomment(commentId);
    removeMutation.mutate(commentId);
  };

  const handleTogglePublish = async (commentId: string, isApproved: boolean) => {
    settogglingcomment(commentId);
    toggleMutation.mutate(commentId);
  };

  if (isLoading) {
    return <CommentModerationSkeleton />;
  }

  return (
    <div className="flex-1 w-full min-w-0 bg-[#0b0d11] text-[#f3f4f6] px-6 py-10 font-sans antialiased selection:bg-[#1d2430] selection:text-white flex flex-col h-full">

  {}
  <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#1b1f27] pb-8 md:flex-row md:items-center">

    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
        <MessageSquare className="h-3.5 w-3.5 stroke-[2]" />
        <span>Moderation Matrix</span>
      </div>

      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
        Community Discussions
      </h1>

      <p className="mt-2 max-w-xl text-sm leading-7 text-[#8b90a0]">
        Audit public registry indexes, process feedback telemetry, and supervise conversational streams.
      </p>
    </div>

    {}
    <div className="flex items-center gap-1.5 rounded-2xl border border-[#222733] bg-[#171b22] p-1 shadow-inner self-start md:self-center shrink-0">

      <button
        onClick={() => setFilter("all")}
        className={`rounded-xl px-4 py-2 text-xs font-medium tracking-tight transition-all duration-200 ${
          filter === "all"
            ? "border border-[#364152] bg-[#1d2430] text-white"
            : "text-[#8b90a0] hover:text-[#d1d5db]"
        }`}
      >
        All Logs
      </button>

      <button
        onClick={() => setFilter("approved")}
        className={`rounded-xl px-4 py-2 text-xs font-medium tracking-tight transition-all duration-200 ${
          filter === "approved"
            ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "text-[#8b90a0] hover:text-[#d1d5db]"
        }`}
      >
        Approved
      </button>

      <button
        onClick={() => setFilter("pending")}
        className={`rounded-xl px-4 py-2 text-xs font-medium tracking-tight transition-all duration-200 ${
          filter === "pending"
            ? "border border-amber-500/20 bg-amber-500/10 text-amber-400"
            : "text-[#8b90a0] hover:text-[#d1d5db]"
        }`}
      >
        Staged
      </button>

    </div>
  </div>

  {}
  <div className="mb-4 space-y-3">

    {isError && (
      <div className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs font-medium tracking-tight text-red-400">
        <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-400" />
        <span>{error?.message || "Internal telemetry failure."}</span>
      </div>
    )}

    {!isLoading && !isError && isFetching && (
      <div className="inline-flex items-center gap-2 rounded-xl border border-[#383f51] bg-[#171b22]/90 px-4 py-2 text-xs font-medium tracking-tight text-[#c2c8d3] backdrop-blur-sm shadow-lg">
        <Loader2 className="h-3 w-3 animate-spin text-[#c2c8d3]" />
        <span>Refreshing transactional registry...</span>
      </div>
    )}

  </div>

  {}
  <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#1b1f27] bg-[#11141a]">

    {}
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_60%)]" />

    <div className="relative w-full min-w-0 flex-1 overflow-x-auto">

      <table className="min-w-[900px] w-full border-collapse text-left">

        <thead className="sticky top-0 z-10 border-b border-[#1b1f27] bg-[#171b22]/95 backdrop-blur-xl">

          <tr className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c8393]">
            <th className="w-[5%] px-5 py-4">ID</th>
            <th className="w-[18%] px-5 py-4">Origin Profile</th>
            <th className="w-[42%] px-5 py-4">Transmission Payload</th>
            <th className="w-[15%] px-5 py-4">Timestamp</th>
            <th className="w-[10%] px-5 py-4">Index Flag</th>
            <th className="w-[5%] px-5 py-4 text-center">Action</th>
            <th className="w-[5%] px-5 py-4 text-center">Purge</th>
          </tr>

        </thead>

        <tbody className="divide-y divide-[#1b1f27]">

          {comments.length === 0 ? (

            <tr>
              <td colSpan={7} className="px-5 py-24 text-center">

                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#222733] bg-[#171b22]">
                  <Inbox className="h-4 w-4 text-[#6b7280]" />
                </div>

                <h3 className="mb-1 text-sm font-medium tracking-tight text-[#d1d5db]">
                  No Records Documented
                </h3>

                <p className="mx-auto max-w-xs text-xs leading-6 text-[#7c8393]">
                  No contextual feedback nodes map onto this directory query profile.
                </p>

              </td>
            </tr>

          ) : (
            comments.map((comment: any, index: number) => {
              const isProcessing = togglingcomment === comment._id;

              return (
                <tr
                  key={comment._id}
                  className="group align-middle transition-all duration-200 hover:bg-[#171b22]/70"
                >

                  {}
                  <td className="px-5 py-4.5 font-mono text-xs text-[#6b7280]">
                    {(index + 1).toString().padStart(2, "0")}
                  </td>

                  {}
                  <td className="min-w-0 px-5 py-4.5">
                    <p className="break-all text-xs font-medium tracking-tight text-[#e5e7eb]">
                      {comment.createdBy?.fullName || "Anonymous Identifier"}
                    </p>
                  </td>

                  {}
                  <td className="min-w-0 px-5 py-4.5">
                    <p className="max-w-xl line-clamp-1 break-all text-sm leading-relaxed text-[#8b90a0]">
                      {comment.content}
                    </p>
                  </td>

                  {}
                  <td className="whitespace-nowrap px-5 py-4.5 text-xs font-medium text-[#7c8393]">
                    {Moment(comment.createdAt).fromNow()}
                  </td>

                  {}
                  <td className="whitespace-nowrap px-5 py-4.5">

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        comment.isApproved
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                          : "border-[#2a313d] bg-[#171b22] text-[#8b90a0]"
                      }`}
                    >
                      <span
                        className={`h-1 w-1 rounded-full ${
                          comment.isApproved
                            ? "bg-emerald-400"
                            : "bg-[#6b7280]"
                        }`}
                      />

                      {comment.isApproved ? "Approved" : "Staged"}
                    </span>

                  </td>

                  {}
                  <td className="whitespace-nowrap px-5 py-4.5 text-center">

                    <button
                      onClick={() =>
                        handleTogglePublish(comment._id, comment.isApproved)
                      }
                      disabled={disableAll}
                      className={`inline-flex h-7 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-medium tracking-tight transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                        comment.isApproved
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
                      {toggleMutation.isPending && isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : comment.isApproved ? (
                        <>
                          <X className="h-3 w-3 stroke-[2.5]" />
                          <span>Restrict</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>

                  </td>

                  {}
                  <td className="whitespace-nowrap px-5 py-4.5 text-center">

                    <button
                      onClick={() => handleRemove(comment._id)}
                      disabled={disableAll}
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
                      title="Purge record sequence"
                    >
                      {removeMutation.isPending && isProcessing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-4.5 w-4.5 stroke-[1.8]" />
                      )}
                    </button>

                  </td>

                </tr>
              );
            })
          )}

        </tbody>
      </table>

    </div>
  </div>
</div>
  );
};

export default Page;