"use client";

import { useState } from "react";
import Link from "next/link";

const testimonials = [
  {
    quote: "HomeVolt helped me complete my Delhi-Jaipur trip without any range anxiety. Super convenient!",
    name: "Rohit S.",
    role: "EV Owner",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.2&w=80&h=80",
  },
  {
    quote: "As a host, I earn extra income every month by sharing my home charger. Totally worth it.",
    name: "Anjali M.",
    role: "Host",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=80&h=80",
  },
  {
    quote: "The booking process is smooth, hosts are trusted, and payments are completely hassle-free.",
    name: "Karan P.",
    role: "EV Owner",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=80&h=80",
  },
];

export default function Hero() {
  const [slide, setSlide] = useState(0);
  const prev = () => setSlide((s) => (s === 0 ? testimonials.length - 1 : s - 1));
  const next = () => setSlide((s) => (s === testimonials.length - 1 ? 0 : s + 1));

  return (
    <section className="relative bg-white text-gray-900 overflow-hidden">

      {/* ─────────────────────────────────────────
          1. HERO — split layout
      ───────────────────────────────────────── */}
      <div className="relative min-h-screen pt-[68px] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* Left: copy */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-20 py-24 lg:py-0 z-10">

          {/* Eyebrow */}
          <div className="flex items-center gap-3.5 mb-7 mt-6">
            <span className="w-5 h-px bg-blue-500" />
            <span className="text-[11px] font-semibold tracking-[2.5px] uppercase text-blue-600">
              Peer-to-peer EV charging
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[48px] sm:text-[58px] lg:text-[64px] font-black leading-[1.04] tracking-[-2px] text-gray-900 mb-6">
            Power Anywhere.
            <br />
            <span className="text-blue-600">Charge Everywhere.</span>
          </h1>

          {/* Sub */}
          <p className="text-gray-500 text-[16px] leading-[1.75] max-w-[440px] mb-10">
            Find trusted home-based EV charging stations, book a slot instantly,
            and continue your journey with confidence.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap mb-12">

          <Link href="/signup">
            <button className="text-[14px] font-bold bg-blue-600 text-white px-7 py-3.5 rounded-xl shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200">
              Sign Up Free
            </button>
          </Link>

          <Link href="/login">
              <button className="text-[14px] font-bold text-blue-600 border border-blue-200 px-7 py-3.5 rounded-xl hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200">
                Log In
              </button>
         </Link>

</div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t border-gray-100">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80",
              ].map((src, i) => (
                <img key={i} src={src} alt="Driver" className="w-10 h-10 rounded-full ring-2 ring-white object-cover" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[12px] text-gray-400 font-semibold">4.8/5 from 500+ drivers</p>
            </div>
          </div>
        </div>

        {/* Right: hero image panel */}
        <div className="relative hidden lg:flex items-center justify-end overflow-hidden bg-slate-50">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://www.tatapower.com/adobe/dynamicmedia/deliver/dm-aid--53513450-e8df-4e47-a0a5-2b4a662395c4/what-affects-ev-charging-time.png?quality=85&preferwebp=true')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent w-1/2" />

          {/* Floating stat card */}
          <div className="absolute bottom-12 left-12 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-lg">⚡</div>
            <div>
              <div className="text-[11px] text-gray-400 font-semibold mb-0.5">Active right now</div>
              <div className="text-[15px] font-black text-gray-900">124 stations nearby</div>
            </div>
          </div>

          {/* Availability pill */}
          <div className="absolute top-16 left-12 bg-white/90 backdrop-blur-md border border-green-100 rounded-full px-4 py-2 flex items-center gap-2 shadow-md">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[12px] font-bold text-gray-700">Slots available now</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          2. HOW IT WORKS
      ───────────────────────────────────────── */}
      <div className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-blue-600 mb-3">Simple process</p>
          <h3 className="text-[26px] font-black text-gray-900 mb-12">
            How <span className="text-blue-600">HomeVolt</span> Works
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 relative max-w-4xl mx-auto">
            <div className="absolute top-5 left-[12.5%] w-[75%] h-px border-t-2 border-dashed border-gray-200 hidden sm:block z-0" />
            {[
              { icon: "🔍", step: "Search", color: "bg-blue-600", desc: "Enter your destination or current location." },
              { icon: "📅", step: "Book", color: "bg-indigo-500", desc: "Reserve a charging slot instantly." },
              { icon: "⚡", step: "Charge", color: "bg-blue-500", desc: "Navigate to the host's location and charge." },
              { icon: "✓", step: "Continue", color: "bg-emerald-600", desc: "Complete payment and continue your trip." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 relative z-10">
                <div className={`w-11 h-11 rounded-full ${item.color} text-white flex items-center justify-center shadow-md text-base`}>
                  {item.icon}
                </div>
                <h4 className="text-[12px] font-black text-gray-900 mt-1">{i + 1}. {item.step}</h4>
                <p className="text-[11px] text-gray-400 font-medium max-w-[150px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          3. FIND CHARGING NEAR YOU
      ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Map */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg h-72 relative">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/010/801/642/small/aerial-clean-top-view-of-the-night-time-city-map-with-street-and-river-001-vector.jpg"
              alt="City map"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {[{ top: "16px", left: "80px" }, { top: "96px", right: "96px" }, { bottom: "64px", left: "128px" }].map((pos, i) => (
              <div key={i} className="absolute w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg text-sm" style={pos}>⚡</div>
            ))}
            <div className="absolute bottom-20 right-20 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg text-sm">🏠</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute -inset-5 rounded-full bg-blue-500/20 animate-ping" />
              <div className="w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-lg" />
            </div>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-[32px] font-black text-gray-900 tracking-tight leading-none">Find Charging</h2>
              <h2 className="text-[32px] font-black text-blue-600 tracking-tight leading-none mt-0.5">Near You</h2>
              <p className="text-[13px] text-gray-400 font-semibold mt-2">Reliable. Nearby. Real-time.</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search city, area, or PIN code"
                className="w-full px-5 py-3.5 border border-gray-200 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-[14px] transition-all pr-12"
              />
              <svg className="w-4 h-4 text-blue-600 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex flex-wrap gap-5 text-[12px] text-gray-700 font-semibold">
              {[
                { color: "bg-green-500", icon: "✓", label: "Available" },
                { color: "bg-blue-600", icon: "⚡", label: "Fast Charger" },
                { color: "bg-green-700", icon: "🏠", label: "Home Charger" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <span className={`w-4 h-4 ${b.color} rounded-full flex items-center justify-center text-[9px] text-white`}>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="border border-gray-100 bg-gray-50 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-12 rounded-xl bg-cover bg-center border border-gray-100 flex-shrink-0"
                  style={{ backgroundImage: "url('https://www.team-bhp.com/sites/default/files/styles/amp_high_res/public/mg-zs-ev-charging-cover.jpg')" }}
                />
                <div>
                  <h4 className="text-[13px] font-black text-gray-900">Sharma Residence</h4>
                  <p className="text-[11px] text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="text-amber-400">★ 4.9</span>
                    <span className="text-gray-300">·</span>
                    <span>(86)</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-blue-500">0.4 km</span>
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[14px] font-black text-gray-900">₹16<span className="text-[11px] text-gray-400 font-medium"> /kWh</span></span>
                <span className="block text-[11px] text-green-600 font-black mt-0.5">● Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          4. BECOME A HOST
      ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-[#f0faf5] to-[#e8f5f0] border border-green-100 rounded-3xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div
            className="h-60 rounded-2xl bg-cover bg-center shadow-sm overflow-hidden"
            style={{ backgroundImage: "url('https://c.ndtvimg.com/2025-08/ji9c264c_tesla_625x300_04_August_25.jpg?im=FeatureCrop,algorithm=dnn,width=300,height=200')" }}
          />
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-[30px] font-black text-gray-900 tracking-tight">
                Become a <span className="text-green-600">Host</span>
              </h2>
              <p className="text-[13px] text-gray-500 font-semibold mt-1">Turn your charger into income</p>
            </div>
            <ul className="flex flex-col gap-2.5 text-[13px] font-semibold text-gray-700">
              {["List your charger in minutes", "Set your own availability", "Earn from every charging session", "Be part of a sustainable future"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[9px] flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-max flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-[13px] py-3 px-6 rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-green-600/20 mt-1">
              Become a Host →
            </button>
          </div>

          {/* Earnings chart */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div>
              <span className="text-[12px] font-black text-gray-900 block">Your Earnings</span>
              <span className="text-[10px] font-semibold text-gray-400 block mt-0.5">This Month</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-black text-gray-900">₹12,540</span>
              <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-lg font-black">+18%</span>
            </div>
            <div className="w-full h-24 relative mt-1">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="35" x2="100" y2="35" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                <line x1="0" y1="5" x2="100" y2="5" stroke="#f3f4f6" strokeWidth="1" />
                <path d="M 0 35 L 16.6 28 L 33.2 32 L 49.8 15 L 66.4 20 L 83 10 L 100 18" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 0 35 L 16.6 28 L 33.2 32 L 49.8 15 L 66.4 20 L 83 10 L 100 18 L 100 40 L 0 40 Z" fill="url(#chartFill)" />
                {[[0, 35], [16.6, 28], [33.2, 32], [49.8, 15], [66.4, 20], [83, 10], [100, 18]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="2" fill="#16a34a" stroke="white" strokeWidth="0.5" />
                ))}
              </svg>
              <div className="flex justify-between text-[9px] font-semibold text-gray-400 mt-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          5. STATS STRIP
      ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="bg-blue-600 rounded-2xl p-6 text-white grid grid-cols-2 md:grid-cols-4 gap-6 shadow-lg shadow-blue-600/20">
          {[
            { icon: "⚡", num: "500+", label: "Active Chargers" },
            { icon: "🔋", num: "10,000+", label: "Charging Sessions" },
            { icon: "📍", num: "50+", label: "Cities" },
            { icon: "😊", num: "95%", label: "User Satisfaction" },
          ].map((s, i) => (
            <div key={i} className={`flex items-center gap-3 justify-center ${i < 3 ? "md:border-r border-white/20" : ""}`}>
              <span className="text-[22px]">{s.icon}</span>
              <div>
                <span className="block text-[20px] font-black leading-none">{s.num}</span>
                <span className="text-[11px] text-blue-100 font-semibold mt-1 block">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────
          6. TESTIMONIALS
      ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="text-center mb-10">
          <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-blue-600 mb-2">Real drivers</p>
          <h3 className="text-[26px] font-black text-gray-900">What Our Users Say</h3>
        </div>

        {/* Desktop: 3 cards */}
        <div className="hidden md:grid grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed flex-1">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" />
                <div>
                  <h5 className="text-[12px] font-black text-gray-900">{t.name}</h5>
                  <span className="text-[10px] text-gray-400 font-semibold">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, j) => (
                <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[14px] text-gray-600 font-medium leading-relaxed">"{testimonials[slide].quote}"</p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <img src={testimonials[slide].img} alt={testimonials[slide].name} className="w-9 h-9 rounded-full object-cover ring-2 ring-white" />
              <div>
                <h5 className="text-[13px] font-black text-gray-900">{testimonials[slide].name}</h5>
                <span className="text-[11px] text-gray-400 font-semibold">{testimonials[slide].role}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-4 mt-4">
            <button onClick={prev} className="w-8 h-8 border border-gray-200 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 transition-all text-base">‹</button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "bg-blue-600 w-4" : "bg-gray-300 w-1.5"}`} />
              ))}
            </div>
            <button onClick={next} className="w-8 h-8 border border-gray-200 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:bg-gray-50 transition-all text-base">›</button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          7. FOOTER
      ───────────────────────────────────────── */}
      <footer className="bg-[#0d1b2e] text-white pt-16 pb-8 px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-start">

          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base">⚡</div>
              <div>
                <h3 className="text-[18px] font-black tracking-tight leading-none">HomeVolt</h3>
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1 block">Powering Every Journey</span>
              </div>
            </div>
            <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-sm">
              HomeVolt connects EV owners with trusted home-based charging stations across the country.
            </p>
            <div className="flex items-center gap-2 mt-1">
              {["facebook", "instagram", "linkedin", "x"].map((icon) => (
                <a key={icon} href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:-translate-y-0.5">
                  <img src={`https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${icon}.svg`} alt={icon} className="w-3.5 h-3.5 invert" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: "Company", links: ["About Us", "Our Impact", "Careers", "Press"] },
            { title: "Community", links: ["Become a Host", "Safety", "Guidelines", "Support"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Refund Policy", "Cookies Policy"] },
          ].map((col) => (
            <div key={col.title} className="lg:col-span-2 flex flex-col gap-3">
              <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-slate-400 font-medium hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Contact</h4>
            <ul className="flex flex-col gap-3">
              {[
                { icon: "✉", text: "hello@homevolt.in", href: "mailto:hello@homevolt.in" },
                { icon: "📞", text: "+91 8853499620", href: "tel:+918853499620" },
                { icon: "📍", text: "New Delhi, India", href: "#" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-2">
                  <span className="text-slate-500 mt-0.5">{item.icon}</span>
                  <a href={item.href} className="text-[13px] text-slate-400 font-medium hover:text-white transition-colors break-all">{item.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-800/60 mt-12 pt-6 text-center">
          <p className="text-[11px] text-slate-500 font-semibold tracking-wide">
            © 2026 HomeVolt. All rights reserved. Built for a greener tomorrow.
          </p>
        </div>
      </footer>
    </section>
  );
}