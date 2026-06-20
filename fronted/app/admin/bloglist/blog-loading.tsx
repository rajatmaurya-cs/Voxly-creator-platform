import React from "react";
import {
  CalendarDays,
  Layers,
} from "lucide-react";

export function BlogPublicationsSkeleton() {
  return (
    <div className="min-h-screen bg-[#050816] text-[#f3f4f6] px-6 py-12 font-sans antialiased">

      <div className="max-w-5xl mx-auto animate-pulse">


        {}
        <div className="mb-10 flex flex-col gap-4 border-b border-white/15 pb-8 sm:flex-row sm:items-center sm:justify-between">

          <div className="space-y-2">

            <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">

              <Layers className="h-3.5 w-3.5 stroke-[2.5] text-white/40" />

              <div className="h-3 w-32 rounded bg-white/20" />

            </div>


            <div className="h-8 w-56 rounded-lg bg-white/20 mt-2" />

            <div className="h-4 w-96 rounded bg-white/10 mt-2" />

          </div>



          <div className="w-28 h-8 rounded-2xl border border-white/15 bg-white/10" />

        </div>





        {}
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


                {}
                <div className="w-32 h-5 rounded-md bg-white/20" />



                {}
                <div className="space-y-2">

                  <div className="h-6 w-3/4 rounded-lg bg-white/20" />

                  <div className="h-4 w-5/6 rounded bg-white/10" />

                </div>





                {}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">

                  <div className="flex items-center gap-1.5">

                    <CalendarDays className="h-3.5 w-3.5 text-white/40" />

                    <div className="h-3.5 w-20 rounded bg-white/10" />

                  </div>


                  <span className="hidden text-white/30 sm:inline">
                    •
                  </span>



                  <div className="flex items-center gap-2">

                    <div className="h-5 w-5 rounded-full bg-white/20" />

                    <div className="h-3.5 w-24 rounded bg-white/10" />

                  </div>


                </div>


              </div>





              {}
              <div className="
              flex shrink-0 items-center gap-2 
              border-t border-white/15 
              pt-4 md:border-t-0 md:pt-0 
              sm:self-end md:self-start lg:self-center
              ">


                {}
                <div className="h-9 w-28 rounded-lg bg-white/10 border border-white/15" />


                {}
                <div className="h-9 w-9 rounded-lg bg-white/10 border border-white/15" />


              </div>


            </div>

          ))}

        </div>


      </div>

    </div>
  );
}