
"use client";

import { useState } from "react";
import Link from "next/link";

export default function HostPage() {
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    chargerName: "",
    chargerType: "",
    connectorType: "",
    address: "",
    city: "",
    pincode: "",
    price: "",
    availability: "",
    description: "",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Frontend demo only. Backend submission will be integrated later.
    setSubmitted(true);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20">
              ⚡
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                HomeVolt
              </h1>
              <p className="text-[9px] font-bold uppercase tracking-[2px] text-slate-400">
                Powering Every Journey
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              HomeVolt Host Program
            </span>

            <h2 className="max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Your Charger.
              <br />
              Your Income.
              <br />
              <span className="text-emerald-400">
                A Greener Tomorrow.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
              Turn your home EV charger into an earning opportunity.
              Share your charging station with EV owners, set your own
              availability, and help make charging accessible to everyone.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#host-form"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-400"
              >
                List Your Charger →
              </a>

              <a
                href="#how-it-works"
                className="rounded-xl border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                How It Works
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Flexible availability
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Set your own price
              </span>
              <span className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                Support cleaner mobility
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur-sm">
              <div
                className="flex min-h-[320px] items-center justify-center rounded-2xl bg-cover bg-center md:min-h-[400px]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, rgba(15,23,42,0.05), rgba(15,23,42,0.35)), url('https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=85')",
                }}
              >
                <div className="rounded-2xl border border-white/20 bg-slate-950/75 px-7 py-6 text-center shadow-xl backdrop-blur-md">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-3xl text-slate-950">
                    ⚡
                  </div>
                  <p className="text-lg font-black text-white">
                    Become a HomeVolt Host
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Share. Charge. Earn.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl sm:-left-6">
              <p className="text-xs font-semibold text-slate-400">
                Your charging station
              </p>
              <p className="mt-1 text-lg font-black text-slate-900">
                Your rules. Your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[2.5px] text-blue-600">
            Why become a host?
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Make More From Your Charger
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Make your charging setup work for you while helping EV
            drivers find convenient charging options.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: "💰",
              title: "Earn Extra Income",
              description:
                "Set your own charging rates and earn from charging sessions.",
            },
            {
              icon: "🕒",
              title: "Your Schedule",
              description:
                "Choose when your charger is available for other drivers.",
            },
            {
              icon: "📍",
              title: "Reach More Drivers",
              description:
                "Make your charging station discoverable to nearby EV owners.",
            },
            {
              icon: "🌱",
              title: "Drive Sustainability",
              description:
                "Help make EV charging more accessible and convenient.",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                {benefit.icon}
              </div>
              <h3 className="text-base font-black text-slate-900">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-white py-16"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold uppercase tracking-[2.5px] text-blue-600">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-black text-slate-900 md:text-4xl">
              Start Hosting in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "01",
                title: "Register",
                description:
                  "Enter your contact information and create your host profile.",
              },
              {
                step: "02",
                title: "List Your Charger",
                description:
                  "Add your charger specifications, location, and pricing.",
              },
              {
                step: "03",
                title: "Set Availability",
                description:
                  "Choose when you want to make your charger available.",
              },
              {
                step: "04",
                title: "Welcome Drivers",
                description:
                  "Make your station available for EV owners to discover and book.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-lg shadow-blue-600/20">
                  {item.step}
                </div>
                <h3 className="text-base font-black text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host registration form */}
      <section
        id="host-form"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
      >
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-3">
          <div className="lg:sticky lg:top-28">
            <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              Host Registration
            </span>

            <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 md:text-4xl">
              Let's Get Your Charger Listed.
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-500 md:text-base">
              Tell us a little about yourself and your charging station.
              These details will help set up your HomeVolt host listing.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Your Information
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Provide accurate contact and charger details. This
                    demo form does not submit or store your information
                    on a server yet.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-9"
            >
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
                    ✓
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-900">
                    Form Completed!
                  </h3>

                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500">
                    Your details have been validated in this demo.
                    The host registration backend is not connected yet,
                    so your information has not been saved.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    Back to Form
                  </button>
                </div>
              ) : (
                <>
                  {/* Personal details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">
                      01. Personal Details
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Tell us who will manage the charging station.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className={labelClass}>
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className={labelClass}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="my-9 border-t border-slate-100" />

                  {/* Charger details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">
                      02. Charger Details
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Share the specifications of your charging station.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="chargerName" className={labelClass}>
                        Charger Name *
                      </label>
                      <input
                        id="chargerName"
                        name="chargerName"
                        value={formData.chargerName}
                        onChange={handleChange}
                        placeholder="e.g. Home Charging Station"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="chargerType" className={labelClass}>
                        Charger Type *
                      </label>
                      <select
                        id="chargerType"
                        name="chargerType"
                        value={formData.chargerType}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select charger type</option>
                        <option value="AC">AC Charger</option>
                        <option value="DC">DC Fast Charger</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="connectorType" className={labelClass}>
                        Connector Type *
                      </label>
                      <select
                        id="connectorType"
                        name="connectorType"
                        value={formData.connectorType}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select connector</option>
                        <option value="Type 2">Type 2</option>
                        <option value="CCS2">CCS2</option>
                        <option value="CHAdeMO">CHAdeMO</option>
                        <option value="Bharat AC-001">Bharat AC-001</option>
                        <option value="Bharat DC-001">Bharat DC-001</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="my-9 border-t border-slate-100" />

                  {/* Location */}
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">
                      03. Charging Station Location
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Where can EV drivers find your charger?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className={labelClass}>
                        Full Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House number, street, locality..."
                        className={`${inputClass} min-h-28 resize-y`}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="pincode" className={labelClass}>
                        PIN Code *
                      </label>
                      <input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="6-digit PIN code"
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        className={inputClass}
                        required
                      />
                    </div>
                  </div>

                  <div className="my-9 border-t border-slate-100" />

                  {/* Pricing and availability */}
                  <div className="mb-8">
                    <h3 className="text-lg font-black text-slate-900">
                      04. Pricing & Availability
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Choose your preferred rate and availability.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="price" className={labelClass}>
                        Price per kWh (₹) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                          ₹
                        </span>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          min="1"
                          step="0.5"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="e.g. 16"
                          className={`${inputClass} pl-9`}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="availability" className={labelClass}>
                        Availability *
                      </label>
                      <select
                        id="availability"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        className={inputClass}
                        required
                      >
                        <option value="">Select availability</option>
                        <option value="24/7">24/7</option>
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Flexible">Flexible Hours</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="description" className={labelClass}>
                        Additional Information
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell drivers about parking, access instructions, or other details..."
                        className={`${inputClass} min-h-28 resize-y`}
                      />
                    </div>
                  </div>

                  <div className="mt-9 rounded-2xl bg-blue-50 p-5">
                    <div className="flex items-start gap-3">
                      <span className="text-xl">ℹ️</span>
                      <p className="text-xs leading-5 text-slate-600">
                        This is a frontend demonstration. Your information
                        will not be saved or published until the host
                        registration API is connected.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                  >
                    Complete Host Registration →
                  </button>

                  <p className="mt-4 text-center text-xs text-slate-400">
                    By continuing, you agree to the HomeVolt host
                    registration process.
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0d1b2e] px-6 py-8 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg">
              ⚡
            </div>
            <span className="text-lg font-black">HomeVolt</span>
          </Link>

          <p className="text-center text-xs text-slate-400">
            Built for a greener tomorrow.
          </p>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            Back to Home ↑
          </Link>
        </div>
      </footer>
    </main>
  );
}