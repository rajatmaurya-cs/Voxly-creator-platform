import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Compass,
  Link as LinkIcon,
  Code2,
  ExternalLink,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#16161a] text-zinc-300 border-t border-zinc-900/60 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-16">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="flex items-center">
              <div className="relative w-20 h-20 shrink-0">
                <Image
                  src="/pixel.png"
                  alt="Veyra Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <span
                className="text-xl font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-200 via-white to-violet-400 bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-orbitron)", letterSpacing: "0.18em" }}
              >
                Veyra
              </span>
            </div>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              Empowering your digital brand with next-generation AI content creation, automated scheduling, and smart analytics.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-10 mt-2">
              <a
                href="https://www.linkedin.com/in/rajat-maurya-3a172331b"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-800/80 text-zinc-400 hover:text-sky-500 hover:border-indigo-500/30 transition-all duration-200"
              >
                <FaLinkedinIn size={30} />
              </a>
              <a
                href="https://github.com/rajatmaurya-cs"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all duration-200"
              >
                <FaGithub size={30} />
              </a>
              {/* <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-800/80 text-zinc-400 hover:text-sky-450 hover:border-sky-500/30 transition-all duration-200"
              >
                <FaTwitter size={30} />
              </a> */}
              <a
                href="mailto:rajatmaurya.dev@gmail.com"
                className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-800/80 text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all duration-200"
              >
                <FaEnvelope size={30} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col lg:justify-self-center">
            <h4 className="text-zinc-450 font-bold text-xs tracking-widest uppercase mb-5">
              Navigation
            </h4>
            <div className="flex flex-col gap-3 text-xs md:text-sm font-medium">
              <Link href="/Home/blogs" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                See Blogs
              </Link>
              <Link href="/admin" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Create Blog
              </Link>
              <Link href="/plans" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Pricing Plans
              </Link>
              <Link href="/leaderboard" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Leaderboard
              </Link>
            </div>
          </div>

          {/* Column 3: Resources Links */}
          <div className="lg:col-span-2 flex flex-col lg:justify-self-center">
            <h4 className="text-zinc-450 font-bold text-xs tracking-widest uppercase mb-5">
              Resources
            </h4>
            <div className="flex flex-col gap-3 text-xs md:text-sm font-medium">
              <Link href="/info/refund" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Refund Policy
              </Link>
              <Link href="/info/privacy-policy" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/info/terms" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/info/about-us" className="text-zinc-400 hover:text-indigo-400 transition-colors">
                About Us
              </Link>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div className="lg:col-span-3 flex flex-col gap-5 lg:justify-self-end">
            <h4 className="text-zinc-450 font-bold text-xs tracking-widest uppercase mb-1">
              Contact Us
            </h4>
            
            <div className="flex flex-col gap-4">
              
              {/* Office Address */}
              {/* <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-450">
                  <MapPin size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200">Hyderabad Office</span>
                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5 leading-relaxed">
                    7-1-458 Ameerpet, Hyderabad,<br />Telangana, IN 500016, India
                  </span>
                </div>
              </div> */}

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200">Phone</span>
                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    +91 63506 24971
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-450">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200">Email</span>
                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5">
                    rajatmauray.dev@gmail.com
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright & Credit Bar */}
        <div className="border-t border-zinc-900/80 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 font-semibold tracking-wide">
            © {new Date().getFullYear()} Veyra. All rights reserved.
          </p>
          <a
            href="https://portfolio-site-kappa-lilac.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-indigo-400 border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700/60 px-3 py-1.5 rounded-lg transition-all duration-200"
          >
            <Code2 size={13} className="text-indigo-400" />
            <span>Designed & Developed by Rajat Maurya</span>
            <ExternalLink size={12} className="text-zinc-500" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;