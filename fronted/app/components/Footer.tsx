import { FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CiShare1 } from "react-icons/ci";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">

 
        <div className="text-center md:text-left">
          <a
            href="https://portfolio-site-kappa-lilac.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-semibold hover:text-gray-300"
          >
            Designed & Developed by Rajat Maurya
            <CiShare1 size={18} />
          </a>

          <p className="text-sm text-gray-400 mt-2">
            Building premium digital experiences.
          </p>
        </div>

   
        <div className="text-center text-sm text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-white font-semibold">Postify</span>. All rights reserved.

          <div className="flex gap-4 justify-center mt-2">
            <Link href="/privacy-policy" className="hover:text-white">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>

   
        <div className="flex gap-4">
          <a href="https://github.com" target="_blank" className="hover:text-gray-400">
            <FaGithub size={18} />
          </a>

          <a href="https://linkedin.com" target="_blank" className="hover:text-gray-400">
            <FaLinkedin size={18} />
          </a>

          <a href="rajatmaurya.dev@gmail.com" className="hover:text-gray-400">
            <MdEmail size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;