import React from "react";

export default function PlansConfigSkeleton() {
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-350">
      {}
      <div className="border-b border-zinc-100 pb-5">
        <div className="h-8 w-48 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-zinc-150 rounded mt-2 animate-pulse" />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-zinc-150 rounded animate-pulse" />
            <div className="h-4 w-24 bg-zinc-150 rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-zinc-200 bg-white h-56 flex flex-col justify-between animate-pulse shadow-sm"
              >
                <div className="space-y-4 w-full">
                  <div className="h-5 w-12 bg-zinc-150 rounded-full" />
                  <div className="h-8 w-24 bg-zinc-200 rounded animate-pulse" />
                  <div className="border-t border-zinc-100 my-1 w-full" />
                  <div className="space-y-2.5">
                    <div className="h-4 w-28 bg-zinc-150 rounded animate-pulse" />
                    <div className="h-4 w-28 bg-zinc-150 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="lg:col-span-1">
          <div className="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm space-y-6 animate-pulse">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="space-y-2">
                {}
                <div className="h-5 w-28 bg-zinc-200 rounded" />
                {}
                <div className="h-3 w-48 bg-zinc-150 rounded mt-1" />
              </div>
              {}
              <div className="w-5 h-5 bg-zinc-150 rounded-full" />
            </div>

            <div className="space-y-4">
              {}
              <div className="space-y-2">
                <div className="h-3 w-24 bg-zinc-150 rounded" />
                <div className="h-9 w-full bg-zinc-100 rounded-lg" />
              </div>

              {}
              <div className="space-y-2">
                <div className="h-3 w-32 bg-zinc-150 rounded" />
                <div className="h-9 w-full bg-zinc-100 rounded-lg" />
              </div>

              {}
              <div className="space-y-2">
                <div className="h-3 w-32 bg-zinc-150 rounded" />
                <div className="h-9 w-full bg-zinc-100 rounded-lg" />
              </div>
            </div>

            {}
            <div className="flex gap-3 pt-2">
              <div className="flex-1 h-9 bg-zinc-100 rounded-lg" />
              <div className="flex-1 h-9 bg-zinc-250 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
