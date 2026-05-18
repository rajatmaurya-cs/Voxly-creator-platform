"use client";

import Image from "next/image";
import Link from "next/link";
import { User, LayoutDashboard } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LOGO: Scaled precisely to fit clean layout geometry */}
        <Link href="/" className="relative h-7 w-28 transition-opacity hover:opacity-90">
          <Image
            src="/LogoOfPostify.png"
            alt="Postify Logo"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        {/* ACTIONS: Minimalist, sharp, and tool-focused */}
        <div className="flex items-center gap-5">

          {/* Sign In: Low-profile text link */}
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors duration-200"
          >
            <User size={15} className="text-zinc-500" />
            <span>Sign In</span>
          </Link>

          {/* Admin: Precision-engineered obsidian button */}
          <Link href="/admin">
            <button className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg 
              bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
              hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
              transition-all duration-200 shadow-sm">
              <LayoutDashboard size={15} className="text-indigo-400" />
              <span>Admin</span>
            </button>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;