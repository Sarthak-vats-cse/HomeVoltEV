
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:8000/auth";

  // Generate verification code
  const sendCode = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Please enter a valid email address."
        );
      }

      setMessage(data.message);
      setStep(2);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to generate verification code."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) return;

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            password,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : "Please check your password reset details."
        );
      }

      setPassword("");
      setConfirmPassword("");
      setCode("");
      setStep(3);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const buttonClass =
    "w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#eff6ff] px-5 pt-28 pb-12">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 md:p-10 shadow-xl">

        {/* HomeVolt Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <img
            src="/logo.png"
            alt="HomeVolt Logo"
            className="h-10 w-10 object-contain"
          />

          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-blue-600">Home</span>
            <span className="text-green-600">Volt</span>
          </h1>
        </Link>

        {/* Step 1: Enter email */}
        {step === 1 && (
          <>
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl">
                🔐
              </div>

              <h2 className="text-2xl font-black text-slate-900">
                Forgot your password?
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Enter your registered email address to
                reset your HomeVolt password.
              </p>
            </div>

            <form onSubmit={sendCode} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  className={inputClass}
                  required
                />
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={buttonClass}
              >
                {loading
                  ? "Generating code..."
                  : "Get Verification Code"}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Verify and reset */}
        {step === 2 && (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-slate-900">
                Reset your password
              </h2>

              <p className="mt-3 text-sm text-slate-500">
                Enter your verification code and choose
                a new password.
              </p>
            </div>

            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-relaxed text-blue-700">
              <strong>Local Demonstration Mode</strong>

              <p className="mt-2">
                {message}
              </p>

              <p className="mt-2">
                Check the backend terminal for your code.
                The code expires after 5 minutes.
              </p>
            </div>

            <form
              onSubmit={resetPassword}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Verification Code
                </label>

                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit code"
                  className={`${inputClass} tracking-widest`}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm New Password
                </label>

                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  className={inputClass}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) =>
                    setShowPassword(e.target.checked)
                  }
                />
                Show passwords
              </label>

              {error && (
                <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={buttonClass}
              >
                {loading
                  ? "Updating password..."
                  : "Reset Password"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setStep(1);
                  setError("");
                  setMessage("");
                  setCode("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="w-full text-sm font-semibold text-blue-600 hover:underline"
              >
                ← Change email or request another code
              </button>
            </form>
          </>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
              ✓
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Password Reset Successful!
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Your password has been updated successfully.
              You can now log in to HomeVolt using your new
              password.
            </p>

            <Link
              href="/login"
              className="mt-7 block rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              Continue to Login →
            </Link>
          </div>
        )}

        {step !== 3 && (
          <div className="mt-7 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
