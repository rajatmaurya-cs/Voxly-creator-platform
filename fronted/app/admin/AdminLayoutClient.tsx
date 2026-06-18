"use client";
import React, { ReactNode, useState } from "react";
import Sidebar from "./Components/sidebar";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation change on mobile
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* MOBILE TOPBAR */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-[#0a0a0a]/90 px-4 py-4 backdrop-blur lg:hidden">

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl border border-zinc-700 bg-zinc-900 p-2"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-sm font-semibold">Admin Panel</h1>

      </div>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed left-0 top-0 z-50 h-screen
          transform transition-transform duration-300
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >

        {/* CLOSE BUTTON MOBILE */}
        <div className="absolute right-4 top-4 lg:hidden">

          <button
            onClick={() => setOpen(false)}
            className="rounded-xl border border-zinc-700 bg-zinc-900 p-2"
          >
            <X size={20} />
          </button>

        </div>

        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <main className="min-h-screen p-4 lg:ml-72 lg:p-6 bg-[#0b0d11]">
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;