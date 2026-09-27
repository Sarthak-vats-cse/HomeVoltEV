
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface User {
  id?: number;
  full_name: string;
  email: string;
  created_at?: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser =
          localStorage.getItem('homevolt_user') ||
          sessionStorage.getItem('homevolt_user');

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          if (
            parsedUser &&
            typeof parsedUser.full_name === 'string' &&
            typeof parsedUser.email === 'string'
          ) {
            setUser(parsedUser);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    loadUser();

    // Update the navbar when login state changes in another tab.
    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('storage', loadUser);
    };
  }, []);

  const initials = user
    ? user.full_name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    : '';

  const handleLogout = () => {
    localStorage.removeItem('homevolt_access_token');
    localStorage.removeItem('homevolt_user');

    sessionStorage.removeItem('homevolt_access_token');
    sessionStorage.removeItem('homevolt_user');

    setUser(null);
    setDropdownOpen(false);

    window.location.href = '/';
  };

  return (
    <nav className="absolute top-0 left-0 w-full bg-transparent px-8 py-4 z-50 flex items-center justify-between">

      {/* Left Section: Logo & Brand Container */}
      <Link
        href="/"
        className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm hover:opacity-95 transition-opacity"
      >
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

      {/* Right Section: Links & Profile */}
      <div className="flex items-center gap-8 bg-white/95 backdrop-blur-md pl-10 pr-6 py-3 rounded-bl-3xl shadow-md">

        {/* Navigation Item Links */}
        <div className="flex items-center gap-8 text-[15px] font-bold text-gray-900">

          <Link
            href="/service-area"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Serviceable Area
          </Link>

          <Link
            href="/subscription"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Subscription
          </Link>

          <Link
            href="/#how-it-works"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            How it Works
          </Link>

          <Link
            href="/about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About Us
          </Link>

          <Link
            href="/docs"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            FAQs
          </Link>
        </div>

        {/* Profile Section */}
        {user && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-label="Open profile menu"
              aria-expanded={dropdownOpen}
              className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center border-2 border-white shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {initials}
            </button>

            {/* Profile Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[60]">

                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="font-bold text-gray-900 truncate">
                    {user.full_name}
                  </div>

                  <div className="text-sm text-gray-500 mt-1 break-all">
                    {user.email}
                  </div>
                </div>

                <div className="p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}