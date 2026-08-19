"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <main className="min-h-screen bg-[#f0f6ff] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 sm:p-10">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden relative">
              <Image
                src="/logo.png"
                alt="HomeVolt Logo"
                width={34}
                height={34}
                className="object-contain"
              />
            </div>

            <span className="text-4xl font-bold text-blue-700">
                Home<span className="text-green-600">Volt</span>
            </span>
                                            
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0f172a]">
            Create account
          </h2>

          <p className="mt-2 text-gray-500 text-sm">
            Start your HomeVolt journey today.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Full name
            </label>

            <input
              type="text"
              placeholder="Shivang Pandey"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirm password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 mt-1 accent-[#2563eb]"
              required
            />

            <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to the{" "}
              <Link href="/terms" className="text-[#2563eb] hover:underline font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-[#2563eb] hover:underline font-medium">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full h-12 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-[#1d4ed8] transition shadow-lg shadow-[#2563eb]/20 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2563eb] hover:underline"
          >
            Log in
          </Link>
        </div>

      </div>
    </main>
  );
}