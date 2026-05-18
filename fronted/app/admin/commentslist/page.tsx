'use client'

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comment/comments`
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
    if (filter === "approved") return allComments.filter((c) => c.isApproved);
    if (filter === "pending") return allComments.filter((c) => !c.isApproved);
    return allComments;
  }, [allComments, filter]);

  const toggleMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const res = await fetch(
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
      const res = await fetch(
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
    if (confirm("Permanently delete this discussion node?")) {
      settogglingcomment(commentId);
      removeMutation.mutate(commentId);
    }
  };

  const handleTogglePublish = async (commentId: string, isApproved: boolean) => {
    settogglingcomment(commentId);
    toggleMutation.mutate(commentId);
  };

  return (
    <div className="flex-1 w-full min-w-0 p-6 sm:p-8 bg-zinc-950 text-zinc-300 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-100 flex flex-col h-full">
      
      {/* HUB CONTROL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-zinc-900 pb-8 gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-zinc-500 mb-1.5 text-[11px] font-semibold tracking-widest uppercase">
            <MessageSquare className="w-3.5 h-3.5 stroke-[2]" />
            <span>Moderation Matrix</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-zinc-100 sm:text-3xl">
            Community Discussions
          </h1>
          <p className="mt-1.5 text-sm font-normal text-zinc-400 max-w-xl leading-relaxed">
            Audit public registry indexes, process feedback telemetry, and supervise conversational streams.
          </p>
        </div>

        {/* INTERACTION FILTER TOOLBAR */}
        <div className="flex items-center gap-1.5 bg-zinc-900/30 border border-zinc-900 p-1 rounded-xl self-start md:self-center shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all ${
              filter === "all"
                ? "bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/50"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Logs
          </button>

          <button
            onClick={() => setFilter("approved")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all ${
              filter === "approved"
                ? "bg-emerald-950/30 text-emerald-400 border border-emerald-900/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Approved
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all ${
              filter === "pending"
                ? "bg-amber-950/20 text-amber-400 border border-amber-900/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Staged
          </button>
        </div>
      </div>

      {/* FEEDBACK TRACKING STATUSES */}
      <div className="space-y-3 mb-4">
        {isError && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-red-950/10 border border-red-950/40 text-red-400 rounded-lg text-xs font-medium tracking-tight">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span>{error?.message || "Internal telemetry failure."}</span>
          </div>
        )}

        {!isLoading && !isError && isFetching && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-zinc-900/40 border border-zinc-900 text-zinc-400 text-xs font-medium rounded-lg tracking-tight">
            <Loader2 className="w-3 h-3 animate-spin text-zinc-500" />
            <span>Refreshing transactional registry...</span>
          </div>
        )}
      </div>

      {/* REGISTRY SCHEDULER MATRIX */}
      <div className="w-full min-w-0 bg-zinc-900/10 rounded-xl border border-zinc-900 overflow-hidden relative flex-1 flex flex-col">
        <div className="w-full min-w-0 flex-1 relative overflow-x-auto">
          <table className="min-w-[900px] w-full table-auto text-left border-collapse">
            <thead className="bg-zinc-900/40 border-b border-zinc-900 sticky top-0 z-10 backdrop-blur-sm">
              <tr className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                <th className="px-5 py-3.5 w-[5%]">ID</th>
                <th className="px-5 py-3.5 w-[18%]">Origin Profile</th>
                <th className="px-5 py-3.5 w-[42%]">Transmission Payload</th>
                <th className="px-5 py-3.5 w-[15%]">Timestamp</th>
                <th className="px-5 py-3.5 w-[10%]">Index Flag</th>
                <th className="px-5 py-3.5 w-[5%] text-center">Action</th>
                <th className="px-5 py-3.5 w-[5%] text-center">Purge</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-900/60">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="animate-pulse align-middle">
                    <td className="px-5 py-4"><div className="h-3 w-4 bg-zinc-900 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-3 w-20 bg-zinc-900 rounded" /></td>
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-zinc-900 rounded" />
                        <div className="h-3 w-2/3 bg-zinc-900 rounded" />
                      </div>
                    </td>
                    <td className="px-5 py-4"><div className="h-3 w-16 bg-zinc-900 rounded" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-zinc-900 rounded-md" /></td>
                    <td className="px-5 py-4"><div className="h-7 w-20 mx-auto bg-zinc-900 rounded-lg" /></td>
                    <td className="px-5 py-4"><div className="h-7 w-7 mx-auto bg-zinc-900 rounded-lg" /></td>
                  </tr>
                ))
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-24 text-center">
                    <div className="w-10 h-10 bg-zinc-900/50 border border-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3.5">
                      <Inbox className="w-4 h-4 text-zinc-600" />
                    </div>
                    <h3 className="text-sm font-medium text-zinc-300 tracking-tight mb-1">
                      No Records Documented
                    </h3>
                    <p className="text-zinc-500 text-xs max-w-xs mx-auto">
                      No contextual feedback nodes map onto this directory query profile.
                    </p>
                  </td>
                </tr>
              ) : (
                comments.map((comment, index) => {
                  const isProcessing = togglingcomment === comment._id;
                  
                  return (
                    <tr
                      key={comment._id}
                      className="group hover:bg-zinc-900/20 transition-all duration-150 align-middle"
                    >
                      {/* MATRIX KEY INDEX */}
                      <td className="px-5 py-4.5 text-xs text-zinc-600 font-mono">
                        {(index + 1).toString().padStart(2, "0")}
                      </td>

                      {/* PROFILE SIGNATURE */}
                      <td className="px-5 py-4.5 min-w-0">
                        <p className="text-xs text-zinc-200 font-medium break-all tracking-tight">
                          {comment.createdBy?.fullName || "Anonymous Identifier"}
                        </p>
                      </td>

                      {/* STRUCTURAL PAYLOAD CONTENT */}
                      <td className="px-5 py-4.5 min-w-0">
                        <p className="text-sm font-normal text-zinc-400 break-words leading-relaxed max-w-xl">
                          {comment.content}
                        </p>
                      </td>

                      {/* TIMESTAMP RECORD */}
                      <td className="px-5 py-4.5 text-xs text-zinc-500 whitespace-nowrap font-medium">
                        {Moment(comment.createdAt).fromNow()}
                      </td>

                      {/* REPOSITORY DEPLOYMENT FLAG */}
                      <td className="px-5 py-4.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase border ${
                            comment.isApproved
                              ? "border-emerald-500/10 bg-emerald-500/5 text-emerald-400"
                              : "border-zinc-800 bg-zinc-800/40 text-zinc-400"
                          }`}
                        >
                          <span className={`w-1 h-1 rounded-full ${comment.isApproved ? "bg-emerald-400" : "bg-zinc-500"}`} />
                          {comment.isApproved ? "Approved" : "Staged"}
                        </span>
                      </td>

                      {/* MUTATION TRANSACTION TRIGGERS */}
                      <td className="px-5 py-4.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleTogglePublish(comment._id, comment.isApproved)}
                          disabled={disableAll}
                          className={`h-7 inline-flex items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium tracking-tight transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border ${
                            comment.isApproved
                              ? "bg-zinc-900 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                              : "bg-zinc-100 border-transparent text-zinc-950 hover:bg-zinc-200"
                          }`}
                        >
                          {toggleMutation.isPending && isProcessing ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : comment.isApproved ? (
                            <>
                              <X className="w-3 h-3 stroke-[2.5]" />
                              <span>Restrict</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>Approve</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* DESTRUCTIVE TRASH HANDLER */}
                      <td className="px-5 py-4.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleRemove(comment._id)}
                          disabled={disableAll}
                          className="w-7 h-7 inline-flex items-center justify-center rounded-md border border-transparent bg-transparent text-zinc-600 transition-all duration-150 hover:border-red-950/60 hover:bg-red-950/20 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed"
                          title="Purge record sequence"
                        >
                          {removeMutation.isPending && isProcessing ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
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