"use client";


import Image from "next/image";
import { X, Mail, Calendar, Shield, LogOut, CheckCircle2, CreditCard, Users,CalendarClock} from "lucide-react";
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
        ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
        : "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";

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
            transition: { type: "spring" as const, duration: 0.5, bounce: 0.2 }
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
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            {/* Modal Wrapper */}
            <motion.div
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-[400px] rounded-[32px] border border-zinc-800/80 shadow-[0_0_80px_-15px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Inner Content Wrapper */}
                <div className="relative z-10 w-full rounded-[30px] bg-[#0c0c0e] flex flex-col overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800/50 hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    
                    {/* Subtle Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />

                    {/* Close Button */}
                    <motion.button
                        onClick={onClose}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 z-20 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 p-2 rounded-full transition-colors cursor-pointer border border-zinc-800"
                    >
                        <X size={16} />
                    </motion.button>

                    <div className="p-6 sm:p-8 flex flex-col">
                        
                        {/* Header: Avatar, Name, Role */}
                        <div className="flex flex-col items-center mb-8 relative z-10">
                            <div className="relative group mb-4">
                                <div className={`absolute -inset-1.5 rounded-full bg-gradient-to-tr ${isAdmin ? 'from-indigo-500 to-purple-500' : 'from-emerald-500 to-teal-500'} opacity-60 blur-md group-hover:opacity-100 transition duration-700`} />
                                <div className="relative h-24 w-24 rounded-full overflow-hidden border-[3px] border-[#0c0c0e] bg-zinc-900">
                                    <Image
                                        src={user?.avatar || "/man.png"}
                                        alt={user?.name || "User"}
                                        fill
                                        sizes="96px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-2 text-center tracking-tight">
                                {user?.name}
                            </h2>

                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase ${roleColor}`}>
                                <Shield size={12} />
                                <span>{user?.role || "User"}</span>
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between transition-colors hover:bg-zinc-900/80">
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-indigo-400" />
                                    <span className="text-xs text-zinc-400 font-medium">Followers</span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-400">
                                    {user?.followers?.length || 0}
                                </span>
                            </div>
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between transition-colors hover:bg-zinc-900/80">
                                <div className="flex items-center gap-2">
                                    <CreditCard size={18} className="text-indigo-400" />
                                    <span className="text-xs text-zinc-400 font-medium">Plan</span>
                                </div>
                                <span className="text-sm font-semibold text-emerald-400 capitalize">
                                    {user?.plan?.name || "Free"}
                                </span>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col divide-y divide-zinc-800/50">
                            
                            {/* Email */}
                            <div className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Mail size={16} className="text-zinc-500" />
                                    <span className="text-sm text-zinc-400">Email</span>
                                </div>
                                <span className="text-sm text-zinc-200 font-medium truncate max-w-[150px] sm:max-w-[180px]">
                                    {user?.email}
                                </span>
                            </div>

                            {/* Joined */}
                            <div className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Calendar size={16} className="text-zinc-500" />
                                    <span className="text-sm text-zinc-400">Joined</span>
                                </div>
                                <span className="text-sm text-zinc-200 font-medium">
                                    {user?.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                        : "-"}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 size={16} className="text-zinc-500" />
                                    <span className="text-sm text-zinc-400">Status</span>
                                </div>
                                <span className="text-sm text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                    Active
                                </span>
                            </div>

                            {/* Expiry */}
                            <div className="flex items-center justify-between p-4 hover:bg-zinc-900/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CalendarClock className="text-zinc-500"/>
                                    <span className="text-sm text-zinc-400">Plan Expires On</span>
                                </div>
                                <span className="text-sm text-zinc-200 font-medium">
                                    {user?.planExpiresAt
                                        ? new Date(user.planExpiresAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                        : "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="mt-8">
                            {isLoggingOut ? (
                                <div className="w-full h-[52px] flex items-center justify-center bg-zinc-900/50 rounded-xl border border-zinc-800">
                                    <EditorLoader size={40} border={3} />
                                </div>
                            ) : (
                                <motion.button
                                    onClick={onLogout}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full h-[52px] flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl border border-red-500/20 transition-colors font-semibold group cursor-pointer"
                                >
                                    <span>Sign Out</span>
                                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            )}
                        </div>

                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserProfileModal;