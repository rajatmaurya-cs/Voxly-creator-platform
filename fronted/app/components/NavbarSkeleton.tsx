import React from "react";
import Link from "next/link";
import Image from "next/image";

const NavbarSkeleton = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {}
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90 group z-50"
        >
          <div className="relative w-27 h-27 shrink-0">
            <Image
              src="/pixel.png"
              alt="Veyra Logo"
              fill
              sizes="108px"
              className="object-contain"
              priority
            />
          </div>
          <span
            className="text-xl sm:text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.15em" }}
          >
            Veyra
          </span>
        </Link>

        {}
        <div className="hidden md:flex items-center gap-4">
          {}
          <button
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-650 animate-pulse mr-2 animate-pulse"
            disabled
          >
            <div className="w-5 h-5 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
          </button>

          {}
          <button
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
              bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-650
              animate-pulse"
            disabled
          >
            <div className="w-5 h-5 rounded bg-zinc-800 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-12" />
          </button>

          {}
          <button
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
              bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-650
              animate-pulse"
            disabled
          >
            <div className="w-5 h-5 rounded bg-zinc-800 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-10" />
          </button>

          {}
          <button
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
              bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-650
              animate-pulse"
            disabled
          >
            <div className="w-5 h-5 rounded bg-zinc-800 animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse w-20" />
          </button>
        </div>

        {}
        <div className="flex md:hidden items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 rounded-full bg-zinc-800 animate-pulse" />
          </div>
          <div className="w-9 h-9 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center animate-pulse">
            <div className="w-5 h-5 rounded bg-zinc-800 animate-pulse" />
          </div>
        </div>

      </div>
    </nav>
  );
};

export default NavbarSkeleton;
