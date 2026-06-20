import React from "react";

export default function BlogSkeleton() {
  return (
    <section className="min-h-screen bg-[#050816] text-white font-sans antialiased relative overflow-hidden">
      {}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-violet-600/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-500/5 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16 animate-pulse">
        {}
        <div className="mb-10 space-y-6">
          {}
          <div className="w-24 h-8 rounded-full border border-cyan-500/20 bg-cyan-500/5" />

          {}
          <div className="space-y-3">
            <div className="h-12 md:h-16 bg-white/10 rounded-2xl w-11/12 max-w-4xl" />
            <div className="h-12 md:h-16 bg-white/10 rounded-2xl w-3/4 max-w-2xl" />
          </div>

          {}
          <div className="space-y-2 max-w-4xl">
            <div className="h-5 bg-white/5 rounded-lg w-full" />
            <div className="h-5 bg-white/5 rounded-lg w-5/6" />
          </div>

          {}
          <div className="flex flex-wrap items-center gap-5 pt-4">
            <div className="flex items-center gap-3">
              {}
              <div className="w-14 h-14 rounded-full border-2 border-white/10 bg-white/10" />
              {}
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded w-28" />
                <div className="h-3 bg-white/5 rounded w-20" />
              </div>
            </div>
            {}
            <div className="flex items-center gap-3">
              <div className="w-28 h-9 rounded-xl border border-white/10 bg-white/5" />
              <div className="w-28 h-9 rounded-xl border border-white/10 bg-white/5" />
            </div>
          </div>
        </div>

        {}
        <div className="relative mb-16 rounded-[36px] border border-white/10 bg-white/5 h-[300px] md:h-[550px] w-full" />

        {}
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-6 md:p-10 space-y-6">
            <div className="h-4 bg-white/10 rounded-md w-full" />
            <div className="h-4 bg-white/10 rounded-md w-11/12" />
            <div className="h-4 bg-white/10 rounded-md w-5/6" />
            <div className="h-4 bg-white/10 rounded-md w-full" />
            <div className="h-4 bg-white/10 rounded-md w-4/5" />
            <div className="h-4 bg-white/10 rounded-md w-3/4" />
            <div className="h-4 bg-white/10 rounded-md w-full" />
            <div className="h-4 bg-white/10 rounded-md w-11/12" />
            <div className="h-4 bg-white/10 rounded-md w-5/6" />
            <div className="h-4 bg-white/10 rounded-md w-2/3" />
          </div>

          {}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8 space-y-6">
            <div className="w-40 h-8 bg-white/10 rounded-lg" />
            <div className="flex flex-wrap md:flex-nowrap justify-between gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex-1 min-w-[120px] h-24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
