"use client";
import Image from "next/image";
import Link from "next/link";
import NavbarSkeleton from "./NavbarSkeleton";

import {
  LayoutGrid,
  User,
  ShieldCheck,
  IndianRupee,
  Trophy,
  Menu,
  X
} from "lucide-react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import UserProfileModal from "./UserProfileModal";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";


const Navbar = () => {

  const { user, loggedIn, setLoggedIn, setUser, authloading } = useContext(AuthContext) as any;

  const [showProfile, setShowProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter()


  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to logout");
      }

      return data;
    },

    onSuccess: (data) => {
      setUser(null);
      setLoggedIn(false);
      setShowProfile(false);
      setIsOpen(false);

      toast.success(data.message || "Logged out successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });


  if (authloading) { return <NavbarSkeleton /> }

  const navLinks = [
    {
      href: "/admin",
      label: "Admin",
      icon: <LayoutGrid size={20} className="text-indigo-400" />,
      onClick: (e: any) => {
        if (!loggedIn) {
          e.preventDefault();
          toast.error("Login First");
          setTimeout(() => router.push('/auth/login'), 2000);
          setIsOpen(false);
        }
      }
    },
    {
      href: "/plans",
      label: "Price",
      icon: <IndianRupee size={20} className="text-indigo-400" />,
    },
    {
      href: "/leaderboard",
      label: "LeaderBoard",
      icon: <Trophy size={20} className="text-indigo-400" />,
    }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90 group z-50"
            onClick={() => setIsOpen(false)}
          >
            <div className="relative w-27 h-27 shrink-0 top-[2px]">
              <Image
                src="/pixel.png"
                alt="Veyra Logo"
                fill
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!loggedIn && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors mr-2"
              >
                <User size={20} className="text-zinc-500" />
                <span>Sign In</span>
              </Link>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.onClick}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                  bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                  hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                  transition-all duration-200"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}

            {loggedIn && (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowProfile(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
                <User size={20} className="text-indigo-400" />
                <span>Profile</span>
              </Link>
            )}

            {loggedIn && (
              <Link
                href="/superadmin"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
                <ShieldCheck size={20} className="text-green-400" />
                <span>Superadmin</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {loggedIn && (
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowProfile(true);
                }}
                className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white"
              >
                <User size={20} />
              </Link>
            )}
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(!isOpen);
              }}
              className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-300 hover:text-white focus:outline-none z-50"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Link>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-45 bg-zinc-950 pt-20 px-6 pb-6 flex flex-col justify-start md:hidden border-b border-zinc-900/80"
          >
            <div className="flex flex-col gap-4 mt-4">
              {!loggedIn && (
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-zinc-300 hover:text-white"
                >
                  <User size={22} className="text-indigo-400" />
                  <span className="font-medium">Sign In</span>
                </Link>
              )}

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (link.onClick) {
                      link.onClick(e);
                    } else {
                      setIsOpen(false);
                    }
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-zinc-300 hover:text-white"
                >
                  {link.icon}
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              {loggedIn && (
                <Link
                  href="/superadmin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-zinc-300 hover:text-white"
                >
                  <ShieldCheck size={22} className="text-green-450" />
                  <span className="font-medium">Superadmin</span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <UserProfileModal
            user={user}
            onClose={() => setShowProfile(false)}
            onLogout={() => logoutMutation.mutate()}
            isLoggingOut={logoutMutation.isPending}
          />
        )}
      </AnimatePresence>

    </>
  );
};

export default Navbar;