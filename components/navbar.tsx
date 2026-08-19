// Location: components/navbar.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full bg-transparent px-8 py-4 z-50 flex items-center justify-between">

      {/* Left Section: Logo & Brand Container */}
      <Link href="/" className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm hover:opacity-95 transition-opacity">
        <img
          src="/logo.png"
          alt="HomeVolt Logo"
          className="w-10 h-10 object-contain rounded-full"
        />

        <div className="flex flex-col leading-none">
          <div className="text-2xl font-black tracking-tight">
            <span className="text-blue-600">Home</span>
            <span className="text-green-600">Volt</span>
          </div>
          <span className="text-[10px] text-gray-600 font-bold tracking-wide mt-0.5">
            Powering Every Journey
          </span>
        </div>
      </Link>

      {/* Right Section: Links & Buttons Wrapper Panel */}
      <div className="flex items-center gap-12 bg-white/95 backdrop-blur-md pl-10 pr-6 py-3 rounded-bl-3xl shadow-md">

        {/* Navigation Item Links */}
        <div className="flex items-center gap-8 text-[15px] font-bold text-gray-900">

          {/* Linked explicitly to the new route folder path */}
          <Link href="/service-area" className="hover:text-blue-600 transition-colors duration-200">
            Serviceable Area
          </Link>

          <Link href="/subscription" className="hover:text-blue-600 transition-colors duration-200">
            Subscription
          </Link>
          <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors duration-200">
            How it Works
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition-colors duration-200">
            About Us
          </Link>
          <Link href="/docs" className="hover:text-blue-600 transition-colors duration-200">
            FAQs
          </Link>
        </div>

      </div>

    </nav>
  );
}