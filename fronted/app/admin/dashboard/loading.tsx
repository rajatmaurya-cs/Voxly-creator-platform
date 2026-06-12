import React from "react";
import {
  FileText,
  MessageSquare,
  FileClock,
  CalendarDays,
  Layers,
} from "lucide-react";

export function StatusSkeleton() {
  const wrapper = "w-full max-w-2xl mx-auto";
  return (
    <div className={wrapper}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-pulse">
        
        {/* Total Blogs Card Skeleton */}
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/50 p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-100" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-zinc-800" />
              <div className="h-8 w-10 rounded-xl bg-zinc-800" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-500/20 via-blue-500/10 to-cyan-500/20 shadow-[0_0_25px_rgba(56,189,248,0.18)]">
              <FileText className="h-5 w-5 text-sky-300/40 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Total Comments Card Skeleton */}
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/50 p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-100" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded-full bg-zinc-800" />
              <div className="h-8 w-10 rounded-xl bg-zinc-800" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/20 via-pink-500/10 to-violet-500/20 shadow-[0_0_25px_rgba(217,70,239,0.18)]">
              <MessageSquare className="h-5 w-5 text-fuchsia-300/40 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Draft Blogs Card Skeleton */}
        <div className="group relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/50 p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] via-transparent to-transparent opacity-100" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-16 rounded-full bg-zinc-800" />
              <div className="h-8 w-10 rounded-xl bg-zinc-800" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20 shadow-[0_0_25px_rgba(251,191,36,0.18)]">
              <FileClock className="h-5 w-5 text-amber-200/40 stroke-[2]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0d11] text-[#f3f4f6] antialiased">
      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10 animate-pulse">
        
        {/* CONTROL HUB HEADER SKELETON */}
        <div className="mb-10 flex flex-col gap-4 border-b border-[#1b1f27] pb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b90a0]">
              <Layers className="h-3.5 w-3.5 stroke-[2] text-zinc-700" />
              <div className="h-3 w-28 rounded bg-[#1b1f27]" />
            </div>
            <div className="h-8 w-48 rounded-lg bg-zinc-800 mt-2" />
            <div className="h-4 w-96 rounded bg-zinc-900 mt-2" />
          </div>
          <div className="w-32 h-8 rounded-2xl border border-[#222733] bg-[#171b22]" />
        </div>

        {/* COMPACT DATA LIST SKELETON */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-[#1b1f27] bg-[#11141a] p-5 flex flex-col justify-between gap-6 md:flex-row md:items-start"
            >
              <div className="flex-1 min-w-0 space-y-3.5">
                {/* Status Badge */}
                <div className="w-28 h-5 rounded-md bg-zinc-800" />
                
                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <div className="h-6 w-3/4 rounded-lg bg-zinc-800" />
                  <div className="h-4 w-5/6 rounded bg-zinc-900" />
                </div>

                {/* Meta details */}
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

              {/* Action Button */}
              <div className="flex shrink-0 items-center border-t border-[#1b1f27] pt-4 md:border-t-0 md:pt-0">
                <div className="h-9 w-28 rounded-xl bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
