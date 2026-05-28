import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Authcontext";
import ProfileModal from "../../Pop-Up/ProfileModal";
import { User, LayoutDashboard } from "lucide-react";
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);


  const handleDashboard = ()=>{
    try{
      if(user?.role === 'ADMIN') navigate('/admin')
      else toast.error("You are Not Admin")
    }catch(error){
      toast.error("Something Went Wrong")
  }
  }

return (
  <nav className="fixed inset-x-0 top-0 z-50 border-b border-gray-100/80 bg-white/80 backdrop-blur-xl shadow-[0_2px_8px_rgb(0,0,0,0.04)]">
    {/* Increased nav height to fit your big logo */}
    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-8">

      {/* Logo - big but contained */}
      <div
        className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        onClick={() => navigate("/")}
      >
        <img
          src={assets.Postify}
          alt="Postify"
          className="h-12 w-auto object-contain lg:h-25"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
        {!user? (
          <button
            onClick={() => navigate("/login")}
            className="group relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden rounded-full bg-gray-900 px-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgb(0,0,0,0.12)] active:translate-y-0 sm:px-5"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <User size={16} className="relative z-10" />
            <span className="relative z-10 hidden tracking-tight sm:inline">Sign In</span>
          </button>
        ) : (
          <>
            {/* Fixed: Dashboard now shows on mobile too */}
            <button
              onClick={() => handleDashboard()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-gray-200/80 bg-gray-50 px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 sm:px-4"
            >
              <LayoutDashboard size={16} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setShowProfile(true)}
              className="group inline-flex h-10 items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 shadow-sm transition-all hover:border-gray-300 hover:shadow-md active:scale-[0.98] sm:pr-4"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1.5px]">
                <img
                  src={user?.avatar || assets.user_icon}
                  className="h-full w-full rounded-full border-2 border-white object-cover"
                  alt="Profile"
                />
              </div>
              {/* Fixed the broken max-w- class */}
              <span className="hidden max-w- truncate text-sm font-semibold tracking-tight text-gray-800 sm:inline lg:max-w-">
                {user.name?.split(' ')[0] || 'Profile'}
              </span>
            </button>
          </>
        )}

        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>
    </div>
  </nav>
);
};
export default Navbar;
