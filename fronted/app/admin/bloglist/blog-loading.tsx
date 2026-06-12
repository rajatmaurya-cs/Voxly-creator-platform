import React from "react";
import {
  CalendarDays,
  Layers,
} from "lucide-react";

export function BlogPublicationsSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6] px-6 py-12 font-sans antialiased">
      <div className="max-w-5xl mx-auto animate-pulse">
        
        {/* DASHBOARD HEADER SKELETON */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#1b1f27] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
              <Layers className="h-3.5 w-3.5 stroke-[2.5] text-zinc-700" />
              <div className="h-3 w-32 rounded bg-[#1b1f27]" />
            </div>
            <div className="h-8 w-56 rounded-lg bg-zinc-800 mt-2" />
            <div className="h-4 w-96 rounded bg-zinc-900 mt-2" />
          </div>
          <div className="w-28 h-8 rounded-2xl border border-[#222733] bg-[#171b22]" />
        </div>

        {/* PUBLICATIONS LIST SKELETON */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-[#1b1f27] bg-[#11141a] p-5 flex flex-col justify-between gap-6 md:flex-row md:items-start"
            >
              <div className="flex-1 min-w-0 space-y-3.5">
                {/* Status Pill */}
                <div className="w-32 h-5 rounded-md bg-zinc-800" />
                
                {/* Title & Description */}
                <div className="space-y-2">
                  <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
                  <div className="h-4 w-5/6 rounded bg-zinc-900" />
                </div>

                {/* Metadata details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-zinc-700" />
                    <div className="h-3.5 w-20 rounded bg-zinc-900" />
                  </div>
                  <span className="hidden text-zinc-800 sm:inline">•</span>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-zinc-800" />
                    <div className="h-3.5 w-24 rounded bg-zinc-900" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex shrink-0 items-center gap-2 border-t border-[#1b1f27] pt-4 md:border-t-0 md:pt-0 sm:self-end md:self-start lg:self-center">
                {/* Toggle Status Button Skeleton */}
                <div className="h-9 w-28 rounded-lg bg-[#171b22] border border-[#222733]" />
                {/* Delete Button Skeleton */}
                <div className="h-9 w-9 rounded-lg bg-[#171b22] border border-[#222733]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
