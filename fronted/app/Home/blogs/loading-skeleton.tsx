import React from "react";

// Reusable Blog Grid Skeleton for client-side search/filters
export function BlogGridSkeleton() {
  return (
    <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
        >
          {/* IMAGE SKELETON */}
          <div className="relative h-60 w-full bg-white/5 overflow-hidden">
            <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 w-20 h-6" />
          </div>

          {/* CONTENT SKELETON */}
          <div className="space-y-5 p-5">
            <div className="space-y-2">
              <div className="h-6 bg-white/10 rounded-lg w-11/12" />
              <div className="h-6 bg-white/10 rounded-lg w-2/3" />
            </div>

            {/* AUTHOR SKELETON */}
            <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full border-2 border-white/10 p-1 w-12 h-12 bg-white/10" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-24" />
                  <div className="h-3 bg-white/10 rounded w-16" />
                </div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] w-12 h-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
