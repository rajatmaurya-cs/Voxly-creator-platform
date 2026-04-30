import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { assets } from "@/app/assets/assets";

const Navbar = () => {
  return (
    <nav className="left-0 right-0 z-50 bg-black py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">


        <Link href="/" className="px-4 py-2 rounded-xl bg-white shadow">
          <Image
            src={assets.Logo}
            alt="Logo"
            width={120}
            height={30}
            className="h-8 w-auto"
          />
        </Link>

        <div className="flex space-x-6">

          <Link href="/login">
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white shadow">
              <User size={18} />
              <span>Sign In</span>
            </button>
          </Link>

          <Link href="/admin">
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-white shadow">
              <User size={18} />
              <span>AdminGo</span>
            </button>
          </Link>



        </div>




      </div>
    </nav>
  );
};

export default Navbar;