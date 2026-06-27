import React from "react";
import {
  FileText,
  MessageSquare,
  FileClock,
  CalendarDays,
  Layers,
  Heart,
  Users,
} from "lucide-react";

export function StatusSkeleton() {
  const wrapper = "w-full max-w-5xl mx-auto";

  return (
    <div className={wrapper}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 animate-pulse">

        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-white/20" />
              <div className="h-8 w-10 rounded-xl bg-white/20" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-500/20">
              <FileText className="h-5 w-5 text-sky-200/60" />
            </div>
          </div>
        </div>


        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded-full bg-white/20" />
              <div className="h-8 w-10 rounded-xl bg-white/20" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/20">
              <MessageSquare className="h-5 w-5 text-fuchsia-200/60" />
            </div>
          </div>
        </div>


        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-16 rounded-full bg-white/20" />
              <div className="h-8 w-10 rounded-xl bg-white/20" />
            </div>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/20">
              <FileClock className="h-5 w-5 text-amber-200/60" />
            </div>
          </div>
        </div>


        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-20 rounded-full bg-white/20" />
              <div className="h-8 w-10 rounded-xl bg-white/20" />
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/20">
              <Heart className="h-5 w-5 text-rose-200/60" />
            </div>
          </div>
        </div>


        <div className="group relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
          <div className="relative flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-3 w-24 rounded-full bg-white/20" />
              <div className="h-8 w-10 rounded-xl bg-white/20" />
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-500/20">
              <Users className="h-5 w-5 text-teal-200/60" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}



export function BlogListSkeleton() {
  return (
    <div className="min-h-screen bg-[#050816] text-[#f3f4f6] antialiased">

      <div className="mx-auto max-w-5xl px-6 py-12 space-y-10 animate-pulse">


        <div className="mb-10 flex flex-col gap-4 border-b border-white/15 pb-8 sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-2">

            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">

              <Layers className="h-3.5 w-3.5 stroke-[2] text-white/40" />

              <div className="h-3 w-28 rounded bg-white/20" />

            </div>


            <div className="h-8 w-48 rounded-lg bg-white/20 mt-2" />

            <div className="h-4 w-96 rounded bg-white/10 mt-2" />

          </div>


          <div className="w-32 h-8 rounded-2xl border border-white/15 bg-white/10" />

        </div>



        <div className="space-y-4">

          {[...Array(3)].map((_, i) => (

            <div
              key={i}
              className="
              relative overflow-hidden rounded-xl 
              border border-white/15 
              bg-white/[0.06] 
              p-5 
              flex flex-col justify-between gap-6 
              md:flex-row md:items-start
              "
            >

              <div className="flex-1 min-w-0 space-y-3.5">


                <div className="w-28 h-5 rounded-md bg-white/20" />


                <div className="space-y-2">

                  <div className="h-6 w-3/4 rounded-lg bg-white/20" />

                  <div className="h-4 w-5/6 rounded bg-white/10" />

                </div>



                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">

                  <div className="flex items-center gap-1.5">

                    <CalendarDays className="h-3.5 w-3.5 text-white/40" />

                    <div className="h-3.5 w-20 rounded bg-white/10" />

                  </div>


                  <span className="hidden text-white/30 sm:inline">•</span>


                  <div className="flex items-center gap-2">

                    <div className="h-5 w-5 rounded-full bg-white/20" />

                    <div className="h-3.5 w-24 rounded bg-white/10" />

                  </div>

                </div>

              </div>



              <div className="flex shrink-0 items-center border-t border-white/15 pt-4 md:border-t-0 md:pt-0">

                <div className="h-9 w-28 rounded-xl bg-white/20" />

              </div>


            </div>

          ))}

        </div>


      </div>

    </div>
  );
}