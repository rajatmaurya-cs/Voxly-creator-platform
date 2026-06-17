"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  FileText,
  Terminal,
  LayoutGrid,
  Heart,
  Trophy,
  BookOpen,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/app/ContextProvider/AuthProvider";
import Router, { useRouter } from "next/navigation";

const Hero = () => {

  const router = useRouter()

  const {loggedIn} = useContext(AuthContext) as any;

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
            Publish with Veyra
          </span>
        </h1>

        {/* SUBTEXT: Clean, readable, and perfectly balanced */}
        <p className="mt-8 max-w-2xl text-base tracking-tight text-zinc-400 sm:text-lg lg:text-xl leading-relaxed">
          An intelligent ecosystem built for modern creators. Generate high-fidelity blogs, condense complex articles instantly, and distribute content seamlessly.
        </p>

        {/* CALL TO ACTIONS */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row w-full sm:w-auto px-4">
          <Link
            href="/admin/generateblog"
            onClick={(e) => {
              if (!loggedIn) {
                e.preventDefault();
                router.push('/auth/login');
              }
            }}
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

        {/* FEATURE GRID SECTION */}
        <div className="mt-36 w-full text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/30 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
            <Sparkles size={11} className="text-indigo-400" />
            <span>Platform Features</span>
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl">
            Everything you need to create & grow
          </h2>
        </div>

        <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 text-left">
          
          {/* Card 1: AI Blog Generator */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <BrainCircuit size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              AI Blog Generator
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-400 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              Generate fully structured, publish-ready blogs from a simple topic or prompt using our AI engine.
            </p>
          </div>

          {/* Card 2: AI Summarizer */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <Terminal size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              AI Summarizer
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-400 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              Paste any long article and get a crisp, concise summary in seconds. Available to all users.
            </p>
          </div>

          {/* Card 3: Author Dashboard */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <LayoutGrid size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              Author Dashboard
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-400 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              A clean workspace to write, edit, and manage all your published blogs in one place.
            </p>
          </div>

          {/* Card 4: Follow & Like */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <Heart size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              Follow & Like
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-400 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              Readers can follow their favourite authors and like blogs to show support and boost visibility.
            </p>
          </div>

          {/* Card 5: Leaderboard */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <Trophy size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              Leaderboard
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-400 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              Compete with other authors. The top followers leaderboard showcases the most popular voices.
            </p>
          </div>

          {/* Card 6: Read & Discover */}
          <div className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-8 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-zinc-900/20 hover:shadow-[0_0_15px_2px_rgba(99,102,241,0.25)]">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all duration-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.4)]">
              <BookOpen size={18} />
            </div>
            <h3 className="text-base font-semibold text-zinc-200 tracking-tight transition-colors duration-300 group-hover:text-white">
              Read & Discover
            </h3>
            <p className="mt-2.5 text-xs md:text-sm leading-relaxed text-zinc-450 font-medium transition-colors duration-300 group-hover:text-zinc-300">
              Browse a curated feed of blogs from authors across the platform, filtered by topic and popularity.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;