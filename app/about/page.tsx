'use client';

import React from 'react';
import Link from 'next/link';

import {
  Zap,
  Users,
  ShieldCheck,
  MapPin,
  Leaf,
  Car,
  Home,
  ArrowRight,
} from 'lucide-react';

import Navbar from '@/components/navbar';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO SECTION
          ===================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 pb-24 pt-[150px] text-white">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">

          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <Zap className="h-4 w-4" />
              About HomeVolt
            </div>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
              Powering Every
              <span className="block text-blue-500">
                Journey.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              HomeVolt is building a community-powered EV charging
              network that makes charging more accessible, convenient,
              and connected for every electric vehicle owner.
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          OUR STORY
          ===================================================== */}

      <section className="px-6 py-20">

        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">

          <div>

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Our Story
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
              Making EV charging easier for everyone.
            </h2>

            <p className="mt-6 leading-7 text-slate-600">
              Finding a convenient EV charger should not be one of the
              hardest parts of owning an electric vehicle. HomeVolt
              was created around a simple idea: connect EV drivers with
              available charging points within local communities.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Instead of relying only on traditional charging
              infrastructure, HomeVolt creates a connected ecosystem
              where verified hosts can make their charging setups
              available to EV owners when they need them.
            </p>

            <p className="mt-4 leading-7 text-slate-600">
              Our goal is to make charging more accessible while
              helping communities participate in the growing EV
              ecosystem.
            </p>

          </div>

          {/* STORY CARD */}

          <div className="relative">

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 p-1 shadow-xl">

              <div className="rounded-[22px] bg-slate-950 p-8 text-white md:p-10">

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                  <Zap className="h-8 w-8 text-emerald-400" />
                </div>

                <h3 className="text-2xl font-bold">
                  Community-powered charging
                </h3>

                <p className="mt-4 leading-7 text-slate-400">
                  A smarter way to connect EV drivers with charging
                  infrastructure around them.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4">

                  <div className="rounded-2xl bg-white/5 p-5">
                    <Users className="mb-3 h-6 w-6 text-blue-400" />

                    <p className="text-sm font-semibold">
                      EV Community
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-5">
                    <MapPin className="mb-3 h-6 w-6 text-emerald-400" />

                    <p className="text-sm font-semibold">
                      Local Network
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          WHAT WE BELIEVE
          ===================================================== */}

      <section className="border-y border-slate-100 bg-slate-50 px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              What We Believe
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Built around people, technology and accessibility.
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* COMMUNITY */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold">
                Community First
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                We believe local communities can play an important
                role in creating a more accessible EV charging
                ecosystem.
              </p>

            </div>

            {/* TRUST */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold">
                Trust & Safety
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Verification and transparency are central to building
                a reliable experience for both EV drivers and charging
                hosts.
              </p>

            </div>

            {/* SUSTAINABILITY */}

            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <Leaf className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold">
                Sustainable Mobility
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                We want to support the transition toward cleaner
                transportation by making EV ownership more practical.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          HOMEVOLT ECOSYSTEM
          ===================================================== */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mb-12">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              The HomeVolt Ecosystem
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              One network. Multiple possibilities.
            </h2>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            {/* HOSTS */}

            <div className="rounded-3xl bg-slate-900 p-8 text-white">

              <Home className="mb-6 h-8 w-8 text-emerald-400" />

              <h3 className="text-xl font-bold">
                Charging Hosts
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                Hosts can make eligible charging setups available
                to EV owners within their communities.
              </p>

            </div>

            {/* DRIVERS */}

            <div className="rounded-3xl bg-blue-600 p-8 text-white">

              <Car className="mb-6 h-8 w-8" />

              <h3 className="text-xl font-bold">
                EV Drivers
              </h3>

              <p className="mt-3 leading-7 text-blue-100">
                Drivers can discover charging options and plan their
                journeys with greater convenience.
              </p>

            </div>

            {/* NETWORK */}

            <div className="rounded-3xl bg-emerald-600 p-8 text-white">

              <MapPin className="mb-6 h-8 w-8" />

              <h3 className="text-xl font-bold">
                Connected Network
              </h3>

              <p className="mt-3 leading-7 text-emerald-100">
                Together, hosts and drivers create a more connected
                charging ecosystem.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
          ===================================================== */}

      <section className="px-6 pb-20">

        <div className="mx-auto max-w-6xl">

          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-14 text-center text-white md:px-16">

            <h2 className="text-3xl font-black md:text-4xl">
              Ready to power your next journey?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-50">
              Discover HomeVolt charging options and become part of
              a growing EV community.
            </p>

            <Link
              href="/service-area"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-600 shadow-lg transition hover:bg-slate-100"
            >
              Explore Service Area

              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}