import React from "react";
import { BlogGridSkeleton } from "./loading-skeleton";

// Default Full-Page Loader for Next.js Route Loading
export default function Loading() {
  return (
    <section className="min-h-screen bg-[#050816] text-white font-sans antialiased">

      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">


        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-6">


          <div className="space-y-3">

            <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
              Explore Blogs
            </h1>


            <p className="max-w-2xl text-sm font-normal text-gray-400 md:text-base">
              Discover premium articles, AI-generated insights, development
              tutorials, and modern tech content curated for developers.
            </p>


          </div>





          {/* SEARCH BAR SKELETON */}
          <div className="relative mx-auto w-full max-w-lg">

            <div
              className="
              w-full h-14 rounded-2xl 
              border border-white/15 
              bg-white/[0.08] 
              animate-pulse
              "
            />

          </div>


        </div>





        {/* CATEGORY FILTER SKELETON */}
        <div className="mb-10 flex flex-wrap justify-center gap-3 animate-pulse">

          {[...Array(6)].map((_, i) => (

            <div
              key={i}
              className="
              rounded-full 
              border border-white/15 
              bg-white/[0.08] 
              px-5 py-2.5 
              h-10 w-24
              "
            />

          ))}


        </div>





        {/* BLOG GRID SKELETON */}
        <BlogGridSkeleton />


      </div>

    </section>
  );
}