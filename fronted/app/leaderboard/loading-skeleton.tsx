import React from "react";

const LeaderboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#22211f] text-white px-4 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <span className="
              px-4 py-1 rounded-full 
              border border-zinc-800 
              bg-zinc-900/40 
              text-zinc-400 
              text-5xl
              font-medium
              flex items-center justify-center gap-1.5
            ">
              🏆 Season Rankings
            </span>
          </div>
          <p className="mt-2 text-zinc-400 text-4xl">
            Compete. Grow. Climb the ranks.
          </p>
        </div>

        {/* TOP THREE SKELETON */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          
          {/* SECOND PLACE */}
          <div className="
            bg-[#2a2927]/30
            border border-zinc-800/80
            rounded-2xl
            p-6
            flex flex-col items-center
            order-2 md:order-1
            animate-pulse
          ">
            <span className="text-7xl mb-3 select-none">🥈</span>
            
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 mb-4" />
            
            {/* Name placeholder */}
            <div className="h-5 bg-zinc-800 rounded w-28 mb-2" />
            
            {/* Followers count placeholder */}
            <div className="h-3 bg-zinc-800 rounded w-20 mt-1" />
            
            {/* Rank number placeholder */}
            <span className="mt-4 h-8 bg-zinc-800 rounded w-10" />
          </div>

          {/* FIRST PLACE */}
          <div className="
            bg-[#2a2927]/30
            border border-zinc-700/50
            rounded-2xl
            p-8
            flex flex-col items-center
            order-1 md:order-2
            md:-translate-y-6
            shadow-lg shadow-amber-500/5
            animate-pulse
          ">
            <span className="text-7xl mb-3 select-none">🥇</span>
            
            {/* Avatar placeholder */}
            <div className="w-20 h-20 rounded-full bg-zinc-800 border border-blue-500/30 mb-4" />
            
            {/* Name placeholder */}
            <div className="h-6 bg-zinc-800 rounded w-32 mb-2" />
            
            {/* Followers count placeholder */}
            <div className="h-3 bg-zinc-800 rounded w-24 mt-1" />
            
            {/* Rank number placeholder */}
            <span className="mt-4 h-9 bg-zinc-800 rounded w-12" />
          </div>

          {/* THIRD PLACE */}
          <div className="
            bg-[#2a2927]/30
            border border-zinc-800/80
            rounded-2xl
            p-6
            flex flex-col items-center
            order-3 md:order-3
            animate-pulse
          ">
            <span className="text-7xl mb-3 select-none">🥉</span>
            
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-full bg-zinc-800 border border-zinc-700 mb-4" />
            
            {/* Name placeholder */}
            <div className="h-5 bg-zinc-800 rounded w-28 mb-2" />
            
            {/* Followers count placeholder */}
            <div className="h-3 bg-zinc-800 rounded w-20 mt-1" />
            
            {/* Rank number placeholder */}
            <span className="mt-4 h-8 bg-zinc-800 rounded w-10" />
          </div>

        </div>

        <hr className="border-zinc-800/50 my-8" />

        {/* REMAINING USERS SKELETON */}
        <div className="flex flex-col gap-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="
                flex items-center justify-between
                py-3.5 px-4
                bg-[#2a2927]/10
                border border-zinc-800/80
                rounded-xl
                animate-pulse
              "
            >
              <div className="flex items-center gap-5">
                {/* Index placeholder */}
                <span className="w-5 text-center text-zinc-650 font-semibold">
                  {index + 4}
                </span>

                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-zinc-800" />

                {/* User Info placeholders */}
                <div className="space-y-2">
                  <div className="h-4 bg-zinc-800 rounded w-28" />
                  <div className="h-3 bg-zinc-800 rounded w-16" />
                </div>
              </div>

              {/* Followers info placeholder */}
              <div className="space-y-1.5 text-right">
                <div className="h-4 bg-zinc-800 rounded w-16 ml-auto" />
                <div className="h-3 bg-zinc-850 rounded w-12 ml-auto" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
