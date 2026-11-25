"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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
          localStorage.getItem("homevolt_user") ||
          sessionStorage.getItem("homevolt_user");

        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          if (
            parsedUser &&
            typeof parsedUser.full_name === "string" &&
            typeof parsedUser.email === "string"
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

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const initials = user
    ? user.full_name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("")
    : "";

  const handleLogout = () => {
    localStorage.removeItem("homevolt_access_token");
    localStorage.removeItem("homevolt_user");

    sessionStorage.removeItem("homevolt_access_token");
    sessionStorage.removeItem("homevolt_user");

    setUser(null);
    setDropdownOpen(false);

    window.location.href = "/";
  };

  return (
    <header className="fixed left-0 top-0 z-[9999] w-full">

      {/* SINGLE CONNECTED NAVBAR */}

      <nav className="flex h-[84px] w-full items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <img
            src="/logo.png"
            alt="HomeVolt Logo"
            className="h-11 w-11 object-contain"
          />

          <div className="flex flex-col leading-none">

            <div className="text-[30px] font-black tracking-tight">
              <span className="text-blue-600">Home</span>
              <span className="text-green-600">Volt</span>
            </div>

            <span className="mt-1 text-[11px] font-bold tracking-wide text-gray-500">
              Powering Every Journey
            </span>

          </div>
        </Link>

        {/* =========================
            RIGHT NAVIGATION
        ========================= */}

        <div className="flex h-full items-center">

          <Link
            href="/service-area"
            className="flex h-full items-center px-5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
          >
            Serviceable Area
          </Link>

          <Link
            href="/subscription"
            className="flex h-full items-center px-5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
          >
            Subscription
          </Link>

          <Link
            href="/how-it-works"
            className="flex h-full items-center px-5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
          >
            How it Works
          </Link>

          <Link
            href="/about"
            className="flex h-full items-center px-5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
          >
            About Us
          </Link>

          <Link
            href="/docs"
            className="flex h-full items-center px-5 text-[15px] font-bold text-slate-900 transition hover:bg-slate-50 hover:text-blue-600"
         >
          FAQs
          </Link>

          {/* =========================
              PROFILE
          ========================= */}

          {user && (
            <div className="relative ml-3">

              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="Open profile menu"
                aria-expanded={dropdownOpen}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                {initials}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-14 z-[10000] w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">

                  <div className="border-b border-gray-100 px-5 py-4">

                    <div className="truncate font-bold text-gray-900">
                      {user.full_name}
                    </div>

                    <div className="mt-1 break-all text-sm text-gray-500">
                      {user.email}
                    </div>

                  </div>

                  <div className="p-2">

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
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

    </header>
  );
}