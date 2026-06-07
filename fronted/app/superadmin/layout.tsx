"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { Shield, BarChart3, Sliders } from "lucide-react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {


  const {user} = useContext(AuthContext)


  const pathname = usePathname();

  // Helper to check active state
  const isStatsActive = pathname === "/superadmin" || pathname.startsWith("/superadmin/aiusagestats");
  const isConfigActive = pathname.startsWith("/superadmin/aiconfig");

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#090d16] p-5 flex flex-col gap-6">
        
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
            <Shield size={20} />
          </div>
          <span className="text-base font-black tracking-wide text-slate-200">
            Super Admin
          </span>
        </div>

        <nav className="flex flex-col gap-1.5">
          
          {/* Stats Link */}
          <Link
            href="/superadmin"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
              isStatsActive
                ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 rounded-r-2xl rounded-l-none pl-3.5"
                : "text-slate-400 hover:bg-white/[0.02] hover:text-white rounded-2xl"
            }`}
          >
            <BarChart3 size={18} className={isStatsActive ? "text-indigo-400" : "text-slate-400"} />
            <span>Stats</span>
          </Link>

          {/* AI Config Link */}
          <Link
            href="/superadmin/aiconfig"
            className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
              isConfigActive
                ? "bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500 rounded-r-2xl rounded-l-none pl-3.5"
                : "text-slate-400 hover:bg-white/[0.02] hover:text-white rounded-2xl"
            }`}
          >
            <Sliders size={18} className={isConfigActive ? "text-indigo-400" : "text-slate-400"} />
            <span>AI Config</span>
          </Link>
        </nav>
      </aside>

        <div className="h-11 w-11 rounded-full p-[2px] bg-white/80">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt="Profile"
                  width={44}
                  height={44}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
      
            {/* Text */}
            <div>
              <h3 className="text-sm font-semibold text-white">
                {user?.name}
              </h3>
              <p className="text-xs text-zinc-500">
                Manage your platform
              </p>
            </div>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default Layout;