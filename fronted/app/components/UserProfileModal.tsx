"use client";

import Image from "next/image";
import { X, Mail, Calendar, Shield, LogOut, CheckCircle2, CreditCard, Users } from "lucide-react";
import { motion } from "framer-motion";
import EditorLoader from "../Animations/EditorLoader";

type UserProfileModalProps = {
    user: {
        id: string;
        name: string;
        email: string;
        avatar: string;
        role: string;
        createdAt: string;
        plan?: {
            name: string;
        } | null;
        planExpiresAt?: string | null;
        followers?: string[];
        following?: string[];
    } | null;
    onClose: () => void;
    onLogout: () => void;
    isLoggingOut: boolean;
};

const UserProfileModal = ({
    user,
    onClose,
    onLogout,
    isLoggingOut,
}: UserProfileModalProps) => {
    const isAdmin = user?.role?.toLowerCase() === "admin";
    const roleColor = isAdmin
        ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/5 ring-indigo-500/20"
        : "text-emerald-400 border-emerald-500/30 bg-emerald-500/5 ring-emerald-500/20";

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 15 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring" as const, duration: 0.4, bounce: 0.15 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onClose}
        >
            {}
            <motion.div
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-[24px] p-[1.5px] bg-zinc-900/50 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.15)]"
            >
                {}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[24px]">
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            backgroundImage: "conic-gradient(from 0deg, transparent 40%, rgba(255,255,255,0.7) 50%, transparent 60%)",
                            originX: 0.5,
                            originY: 0.5,
                        }}
                        className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
                    />
                </div>

                {}
                <div className="relative z-10 w-full rounded-[23px] bg-zinc-950 p-8 overflow-hidden">
                    {}
                    <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-rose-500/10 rounded-full blur-[80px] pointer-events-none" />

                    {}
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute top-5 right-5 text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-800/80 p-2 rounded-full border border-zinc-800/60 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </motion.button>

                    {}
                    <div className="flex flex-col items-center mt-4 mb-6">
                        <div className="relative group">
                            {}
                            <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr ${isAdmin ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-500'} opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200`} />

                            <div className="relative h-28 w-28 rounded-full overflow-hidden border-2 border-zinc-900 bg-zinc-950">
                                <Image
                                    src={user?.avatar || "/man.png"}
                                    alt={user?.name || "User"}
                                    fill
                                    sizes="112px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent mt-4 tracking-tight">
                            {user?.name}
                        </h2>

                        {}
                        <div className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-0.5 text-xs font-semibold ring-1 ${roleColor}`}>
                            <Shield size={12} />
                            <span className="capitalize">{user?.role || "User"}</span>
                        </div>
                    </div>

                    {}
                    <div className="space-y-3.5 my-6">
                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3 w-full">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                    <Mail size={16} />
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Email Address</span>
                                    <span className="text-sm text-zinc-300 font-medium truncate">{user?.email}</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                    <Calendar size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Joined On</span>
                                    <span className="text-sm text-zinc-300 font-medium">
                                        {user?.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                    <Users size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Followers</span>
                                    <span className="text-sm text-zinc-300 font-medium">
                                        {user?.followers?.length || 10} followers
                                    </span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-emerald-500">
                                    <CheckCircle2 size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Status</span>
                                    <span className="text-sm text-zinc-300 font-medium">Active Account</span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                    <CreditCard size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Current Plan</span>
                                    <span className="text-sm text-zinc-300 font-medium capitalize">
                                        {user?.plan?.name || "Free"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {}
                        <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-900 hover:border-zinc-850 hover:bg-zinc-900/60 transition-all duration-300">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60 text-zinc-400 group-hover:text-indigo-400 transition-colors">
                                    <Calendar size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Plan Expires At</span>
                                    <span className="text-sm text-zinc-300 font-medium">
                                        {user?.planExpiresAt
                                            ? new Date(user.planExpiresAt).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "Null"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    {isLoggingOut ? (
                        <div className="w-full mt-8 flex items-center justify-center">
                            <EditorLoader size={40} border={3} />
                        </div>
                    ) : (
                        <motion.button
                            onClick={onLogout}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="
      w-full
      mt-6
      py-3.5
      px-4
      rounded-2xl
      border
      border-red-500/20
      font-semibold
      transition-all
      duration-300
      flex
      items-center
      justify-center
      gap-2
      group
      cursor-pointer
      bg-gradient-to-r
      from-red-500/10
      to-rose-600/10
      hover:from-red-650
      hover:to-rose-650
      text-red-400
      hover:text-white
      shadow-[0_0_20px_rgba(239,68,68,0.05)]
      hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]
    "
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium">Logout</span>
                                <LogOut
                                    size={18}
                                    className="transition-transform duration-200 group-hover:translate-x-1"
                                />
                            </div>
                        </motion.button>
                    )}



                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserProfileModal;