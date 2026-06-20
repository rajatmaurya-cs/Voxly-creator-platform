'use client'
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-black shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10">
            <Image
              src="/pixel.png" 
              alt="Logo"
            
              width={50}
              height={50}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-800">BrandName</span>
        </Link>

        {}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
            About
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-blue-600 transition">
            Services
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition">
            Contact
          </Link>
        </div>

        {}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-gray-800 transition ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transition ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-800 transition ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            About
          </Link>
          <Link href="/services" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Services
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}