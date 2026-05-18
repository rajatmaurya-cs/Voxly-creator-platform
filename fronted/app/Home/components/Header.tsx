"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  FileText,
  Terminal,
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-zinc-50 selection:bg-zinc-800 selection:text-zinc-100">
      
      {/* BACKGROUND GRAPHICS: Sophisticated, subdued ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Fine, dim grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        {/* Soft, top-centered premium ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[1000px] bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-cyan-500/10 blur-[120px] rounded-full opacity-70" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-32 text-center z-10">
        
        {/* PREMIUM BADGE */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3.5 py-1.5 text-xs font-medium tracking-wider text-zinc-400 uppercase backdrop-blur-md transition-colors duration-300 hover:border-zinc-700">
          <Sparkles size={12} className="text-violet-400 animate-pulse" />
          <span>The Future of Publishing</span>
        </div>

        {/* HEADING: Stark, tight, and high-contrast */}
        <h1 className="mt-8 max-w-4xl text-4xl  tracking-tighter sm:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text text-transparent leading-[1.05]">
          Write. Summarize.
          <br />
          <span className="bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent">
            Publish with Postify
          </span>
        </h1>

        {/* SUBTEXT: Clean, readable, and perfectly balanced */}
        <p className="mt-8 max-w-2xl text-base tracking-tight text-zinc-400 sm:text-lg lg:text-xl leading-relaxed">
          An intelligent ecosystem built for modern creators. Generate high-fidelity blogs, condense complex articles instantly, and distribute content seamlessly.
        </p>

        {/* CALL TO ACTIONS */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row w-full sm:w-auto px-4">
          <Link
            href="/Home/create"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-950 transition-all duration-200 hover:bg-zinc-200 w-full sm:w-auto"
          >
            Start Writing
            <ArrowRight size={16} className="text-zinc-950 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          
          <Link
            href="/Home/blogs"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/20 px-6 py-3 text-sm font-medium text-zinc-400 backdrop-blur-md transition-all duration-200 hover:border-zinc-700 hover:text-zinc-200 w-full sm:w-auto"
          >
            See Blogs
          </Link>
        </div>

        {/* FEATURE GRID: Clean architecture with micro-interactions */}
        <div className="mt-28 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 text-left">
          
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-colors duration-300">
              <BrainCircuit size={20} />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 tracking-tight">
              AI Engine
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
              Generate fully articulated, structurally sound prose dynamically customized to your unique editorial tone.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors duration-300">
              <Terminal size={20} />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 tracking-tight">
              Smart Context
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
              Distill high-density technical articles or research into clear, ultra-readable summaries in milliseconds.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/20 p-8 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900/40">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-colors duration-300">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-medium text-zinc-200 tracking-tight">
              Premium Engine
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">
              Ship content via a meticulously crafted infrastructure optimized explicitly for reading experience, speed, and aesthetics.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;