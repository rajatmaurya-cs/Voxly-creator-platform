"use client";
import Image from "next/image";
import Link from "next/link";
import NavbarSkeleton from "./NavbarSkeleton";

import {
  LayoutGrid,
  User,
  ShieldCheck,
  IndianRupee,
   Trophy
} from "lucide-react";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import UserProfileModal from "./UserProfileModal";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
const Navbar = () => {

  const { user, loggedIn, setLoggedIn, setUser , authloading } = useContext(AuthContext) as any;

  const [showProfile, setShowProfile] = useState(false);

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

      toast.success(data.message || "Logged out successfully");
    },

    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });


  const handleAdmin  = ()=>{


    if(!loggedIn){
      toast.error("Login First")
      setTimeout(()=>{
        router.push('/auth/login')
      },2000)
      return ;
    }

    

    router.push('/admin')


  }

if(authloading) {return <NavbarSkeleton/>}

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="relative h-8 w-36 transition-opacity hover:opacity-90"
          >
            <Image
              src="/LogoOfPostify.png"
              alt="Postify Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

         

          <div className="flex items-center gap-4">
            {!loggedIn && (
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <User size={22} className="text-zinc-500" />
                <span>Sign In</span>
              </Link>
            )}

      
             
                <button onClick={()=> handleAdmin()}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                  bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                  hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                  transition-all duration-200"
                >
                  <LayoutGrid
                    size={22}
                    className="text-indigo-400"
                  />
                  <span>Admin</span>
                </button>
            
          

          
              <button
                onClick={()=>router.push('/plans')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
              
                <IndianRupee size={22} className="text-indigo-400" />
                <span>Price</span>
              </button>
           

            {loggedIn &&  (
              <button
                onClick={() => setShowProfile(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
                <User size={22} 
                className="text-indigo-400"
                />
                <span>Profile</span>
              </button>
            )}


             {loggedIn && (
              <button
                onClick={()=>router.push('/superadmin')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
              
                <ShieldCheck size ={22}
                className="text-green-400"
                />
                <span>Superadmin</span>

              </button>
            )}

         
              <button
                onClick={()=>router.push('/leaderboard')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg
                bg-zinc-900/60 border border-zinc-800 text-sm font-medium text-zinc-300
                hover:bg-zinc-900 hover:border-zinc-700 hover:text-zinc-100
                transition-all duration-200"
              >
              
                <Trophy size ={22}
                className="text-indigo-400"
                />
                <span>LeaderBoard</span>

              </button>
            



          </div>
        </div>
      </nav>

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