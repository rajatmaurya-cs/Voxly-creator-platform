import React from "react";

export default function Loading() {
  return (
    <div className="w-full max-w-5xl py-4 space-y-8 animate-pulse">
      {}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-zinc-200 rounded-md" />
        <div className="h-4 w-96 bg-zinc-200 rounded-md" />
      </div>

      {}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-6 h-36"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 bg-zinc-250 rounded" />
              <div className="h-9 w-9 bg-zinc-200 rounded-lg" />
            </div>
            <div className="h-8 w-24 bg-zinc-250 rounded-md mt-6" />
          </div>
        ))}
      </div>

      {}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 p-6 flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-5 w-36 bg-zinc-250 rounded" />
            <div className="h-3.5 w-60 bg-zinc-200 rounded" />
          </div>
          <div className="h-5 w-5 bg-zinc-200 rounded-full" />
        </div>

        <div className="flex flex-col">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-5 border-b border-zinc-100 p-6 md:flex-row md:items-center md:justify-between last:border-none"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-zinc-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-zinc-250 rounded" />
                  <div className="h-3 w-20 bg-zinc-200 rounded" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-7 w-20 bg-zinc-200 rounded-md" />
                <div className="h-7 w-24 bg-zinc-200 rounded-md" />
              </div>
              <div className="h-4 w-24 bg-zinc-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-6">
        <div className="flex gap-4 items-center mb-6">
          <div className="h-9 w-9 bg-zinc-200 rounded-lg" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-zinc-250 rounded" />
            <div className="h-3.5 w-48 bg-zinc-200 rounded" />
          </div>
        </div>
        <div className="h-48 rounded-lg bg-zinc-50 border border-dashed border-zinc-300" />
      </div>
    </div>
  );
}
