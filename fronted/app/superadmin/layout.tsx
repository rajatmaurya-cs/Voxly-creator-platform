"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0b1220] p-4">
        
        <h1 className="mb-6 text-lg font-semibold text-white/80">
          Super Admin
        </h1>

        <nav className="flex flex-col gap-2">
          
          {/* Stats Link */}
          <Link
            href="/superadmin"
            className={`rounded-lg px-3 py-2 text-sm transition ${
              pathname === "/superadmin"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            Stats
          </Link>

          {/* AI Config Link */}
          <Link
            href="/superadmin/aiconfig"
            className={`rounded-lg px-3 py-2 text-sm transition ${
              pathname === "/superadmin/aiconfig/configserver"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            AI Config
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;