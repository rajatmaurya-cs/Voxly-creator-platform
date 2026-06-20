import React from "react";

export default function LoadingAiConfig() {
  return (
    <div className="p-4 sm:p-8 animate-pulse w-full max-w-5xl">
      {}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="h-8 w-56 bg-zinc-200 rounded-md" />
          <div className="h-4 w-96 bg-zinc-200 rounded-md" />
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {}
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-8 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-zinc-200" />
            <div className="h-7 w-14 rounded-full bg-zinc-200" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-36 bg-zinc-250 rounded" />
            <div className="h-3 w-full bg-zinc-200 rounded" />
            <div className="h-3 w-5/6 bg-zinc-200 rounded" />
          </div>
          <div className="h-6 w-24 bg-zinc-200 rounded mt-6" />
        </div>

        {}
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-8 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-zinc-200" />
            <div className="text-right space-y-1">
              <div className="h-8 w-16 bg-zinc-250 rounded ml-auto" />
              <div className="h-3.5 w-16 bg-zinc-200 rounded ml-auto" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-32 bg-zinc-250 rounded" />
            <div className="h-3 w-5/6 bg-zinc-200 rounded" />
          </div>
          <div className="h-2 w-full bg-zinc-200 rounded-lg mt-6" />
        </div>

        {}
        <div className="bg-zinc-50 rounded-xl border border-zinc-200 p-8 h-64 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-zinc-200" />
            <div className="text-right space-y-1">
              <div className="h-8 w-10 bg-zinc-250 rounded ml-auto" />
              <div className="h-3.5 w-16 bg-zinc-200 rounded ml-auto" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="h-4 w-36 bg-zinc-250 rounded" />
            <div className="h-3 w-5/6 bg-zinc-200 rounded" />
          </div>
          <div className="h-2 w-full bg-zinc-200 rounded-lg mt-6" />
        </div>
      </div>

      {}
      <div className="max-w-5xl mb-16">
        <div className="h-12 w-full bg-zinc-200 rounded-lg" />
      </div>
    </div>
  );
}
