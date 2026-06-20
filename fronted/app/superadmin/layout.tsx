"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext, useState } from "react";
import { Shield, BarChart3, Sliders, ArrowLeft, Menu, X, CreditCard } from "lucide-react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useContext(AuthContext) as any;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  
  const isStatsActive = pathname === "/superadmin" || pathname.startsWith("/superadmin/aiusagestats");
  const isConfigActive = pathname.startsWith("/superadmin/aiconfig");
  const isPlansActive = pathname.startsWith("/superadmin/plansconfig");

  
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white text-zinc-900 lg:flex-row animate-fade-in">
      {}
      <div 
        className="sticky top-0 z-40 flex shrink-0 items-center justify-between border-b bg-[#f8f9fa] px-4 py-3 lg:hidden"
        style={{ borderColor: "#e4e4e7" }}
      >
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg border bg-white p-2 text-zinc-700 transition hover:bg-zinc-150 hover:text-black shadow-xs"
          style={{ borderColor: "#e4e4e7" }}
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold tracking-tight text-black">
          Super Admin
        </span>
        <div className="w-10 h-10" /> {}
      </div>

      {}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {}
      <div
        className={`
          fixed left-0 top-0 z-50 h-screen w-64
          transform transition-transform duration-300
          lg:relative lg:translate-x-0 lg:z-auto lg:h-full lg:w-auto lg:shrink-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {}
        <div className="absolute right-4 top-4 z-50 lg:hidden">
          <button
            onClick={() => setOpen(false)}
            className="rounded-lg border bg-white p-2 text-zinc-700 transition hover:bg-zinc-150 hover:text-black shadow-xs"
            style={{ borderColor: "#e4e4e7" }}
          >
            <X size={18} />
          </button>
        </div>

        {}
        <aside 
          className="flex h-full w-64 flex-col gap-6 border-r bg-[#f8f9fa] p-5 shadow-xs"
          style={{ borderColor: "#e4e4e7" }}
        >
          {}
          <div className="flex items-center justify-between px-1 py-2 mb-4">
            <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 group">
              <div className="relative w-27 h-27 shrink-0 -my-6 -mx-6">
                <Image
                  src="/pixel.png"
                  alt="Veyra Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span
                  className="text-2xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-800 via-purple-700 to-fuchsia-700 bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.15em" }}
                >
                  Veyra
                </span>
                <span className="text-[10px] tracking-wide text-zinc-500 font-bold mt-0.5 ml-6">
                  Super Admin
                </span>
              </div>
            </Link>
           
          </div>

          <nav className="flex flex-col gap-6">
            <div>
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2.5 px-2">
                Monitoring
              </div>
              <Link
                href="/superadmin"
                className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                  isStatsActive
                    ? "bg-white border text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    : "text-zinc-700 hover:bg-zinc-200/40 hover:text-black"
                }`}
                style={isStatsActive ? { borderColor: "#e4e4e7" } : undefined}
              >
                <BarChart3 size={14} strokeWidth={2.5} className={isStatsActive ? "text-black" : "text-zinc-600"} />
                <span>Usage Statistics</span>
              </Link>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2.5 px-2">
                Infrastructure
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href="/superadmin/aiconfig"
                  className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                    isConfigActive
                      ? "bg-white border text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      : "text-zinc-700 hover:bg-zinc-200/40 hover:text-black"
                  }`}
                  style={isConfigActive ? { borderColor: "#e4e4e7" } : undefined}
                >
                  <Sliders size={14} strokeWidth={2.5} className={isConfigActive ? "text-black" : "text-zinc-600"} />
                  <span>AI Configuration</span>
                </Link>
                <Link
                  href="/superadmin/plansconfig"
                  className={`relative flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                    isPlansActive
                      ? "bg-white border text-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                      : "text-zinc-700 hover:bg-zinc-200/40 hover:text-black"
                  }`}
                  style={isPlansActive ? { borderColor: "#e4e4e7" } : undefined}
                >
                  <CreditCard size={14} strokeWidth={2.5} className={isPlansActive ? "text-black" : "text-zinc-600"} />
                  <span>Plans Configuration</span>
                </Link>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2.5 px-2">
                Exit
              </div>
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-xs font-bold tracking-wide text-zinc-700 transition hover:bg-zinc-200/40 hover:text-black"
              >
                <ArrowLeft size={14} strokeWidth={2.5} className="text-zinc-600" />
                <span>Back to Site</span>
              </Link>
            </div>
          </nav>

          {}
          <div className="mt-auto">
            <div 
              className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-zinc-50 cursor-pointer"
              style={{ borderColor: "#e4e4e7" }}
            >
              <div 
                className="relative h-8 w-8 shrink-0 rounded-full border bg-zinc-50 p-[1px] overflow-hidden"
                style={{ borderColor: "#e4e4e7" }}
              >
                <Image
                  src={(user?.avatar && user.avatar !== "") ? user.avatar : "/user.png"}
                  alt="Profile"
                  fill
                  className="rounded-full"
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold tracking-tight text-black">
                  {user?.name || "Super Admin"}
                </div>
                <div className="truncate text-[9px] tracking-wide text-zinc-500 font-bold mt-0.5">
                  Manage Platform
                </div>
              </div>

          
            </div>
          </div>
        </aside>
      </div>

      {}
      <main className="w-full flex-1 overflow-y-auto bg-white px-6 py-8 md:px-10 lg:px-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
