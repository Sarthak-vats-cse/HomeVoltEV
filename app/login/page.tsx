
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

function getErrorMessage(detail: unknown): string {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item: unknown) => {
        if (
          typeof item === "object" &&
          item !== null &&
          "msg" in item &&
          typeof item.msg === "string"
        ) {
          return item.msg;
        }

        return "";
      })
      .filter(Boolean)
      .join(", ");
  }

  return "";
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          getErrorMessage(data.detail) ||
            "Invalid email or password."
        );
        return;
      }

      if (!data.access_token || !data.user) {
        setError(
          "Login response is incomplete. Please try again."
        );
        return;
      }

      // Clear any previous authentication data.
      localStorage.removeItem("homevolt_access_token");
      localStorage.removeItem("homevolt_user");
      sessionStorage.removeItem("homevolt_access_token");
      sessionStorage.removeItem("homevolt_user");

      // Store authentication information.
      const storage = rememberMe
        ? localStorage
        : sessionStorage;

      storage.setItem(
        "homevolt_access_token",
        data.access_token
      );

      storage.setItem(
        "homevolt_user",
        JSON.stringify(data.user)
      );

      // Login successful.
      window.location.href = "/";
    } catch {
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

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
                className="object-contain w-[34px] h-[34px]"
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
            Welcome back
          </h2>

          <p className="mt-2 text-gray-500 text-sm">
            Log in to continue your HomeVolt journey.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>

          {/* Email */}
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Email address
            </label>

            <input
              id="loginEmail"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="loginPassword"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2563eb] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 text-gray-800"
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 accent-[#2563eb]"
            />

            <label
              htmlFor="remember"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Remember me
            </label>
          </div>

          {/* Error */}
          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 text-center"
            >
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-[#1d4ed8] transition shadow-lg shadow-[#2563eb]/20 mt-2 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Back to Signup */}
        <div className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#2563eb] hover:underline"
          >
            Create an account
          </Link>
        </div>

      </div>
    </main>
  );
}