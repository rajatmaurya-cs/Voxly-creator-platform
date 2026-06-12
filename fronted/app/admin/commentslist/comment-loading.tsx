import React from "react";
import { MessageSquare } from "lucide-react";

export function CommentModerationSkeleton() {
  return (
    <div className="flex-1 w-full min-w-0 bg-[#0b0d11] text-[#f3f4f6] px-6 py-10 font-sans antialiased flex flex-col h-full animate-pulse">
      
      {/* HUB CONTROL HEADER SKELETON */}
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#1b1f27] pb-8 md:flex-row md:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
            <MessageSquare className="h-3.5 w-3.5 stroke-[2] text-zinc-700" />
            <div className="h-3 w-32 rounded bg-[#1b1f27]" />
          </div>
          <div className="h-8 w-64 rounded-lg bg-zinc-800 mt-2" />
          <div className="h-4 w-96 rounded bg-zinc-900 mt-2" />
        </div>

        {/* Filter Toolbar Skeleton */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-[#222733] bg-[#171b22] p-1 self-start md:self-center shrink-0 w-64 h-10" />
      </div>

      {/* REGISTRY MATRIX SKELETON */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-3xl border border-[#1b1f27] bg-[#11141a]">
        <div className="relative w-full min-w-0 flex-1 overflow-x-auto">
          <table className="min-w-[900px] w-full border-collapse text-left">
            <thead>
              <tr className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7c8393] border-b border-[#1b1f27] bg-[#171b22]/95">
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
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="align-middle">
                  <td className="px-5 py-5">
                    <div className="h-3 w-4 rounded bg-[#171b22]" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="h-3 w-28 rounded bg-[#171b22]" />
                  </td>
                  <td className="px-5 py-5 font-sans">
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-[#171b22]" />
                      <div className="h-3 w-2/3 rounded bg-[#171b22]" />
                    </div>
                  </td>
                  <td className="px-5 py-5">
                    <div className="h-3 w-16 rounded bg-[#171b22]" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="h-5 w-16 rounded-md bg-[#171b22]" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="mx-auto h-7 w-20 rounded-lg bg-[#171b22]" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="mx-auto h-7 w-7 rounded-lg bg-[#171b22]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
