"use client";

import React from "react";
import Link from "next/link";

import {
  Search,
  MapPin,
  CalendarCheck,
  Zap,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  Home,
  Car,
} from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find a Charger",
      description:
        "Search for verified HomeVolt charging stations near your location and explore available charging options.",
    },
    {
      number: "02",
      icon: MapPin,
      title: "Choose Your Location",
      description:
        "View available charging points, check their location and availability, and choose the station that works for you.",
    },
    {
      number: "03",
      icon: CalendarCheck,
      title: "Book Your Slot",
      description:
        "Select a convenient charging time and reserve your slot before reaching the charging location.",
    },
    {
      number: "04",
      icon: Zap,
      title: "Charge & Continue",
      description:
        "Reach the charging location, charge your EV, and continue your journey with confidence.",
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-6 pb-24 pt-[150px] text-white">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-400">
            <Zap className="h-4 w-4" />
            Simple. Smart. Connected.
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Charging Your EV
            <span className="block text-blue-500">
              Made Simple.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            HomeVolt connects EV drivers with verified community
            charging points, making it easier to find, book, and
            use a charger whenever you need one.
          </p>

        </div>
      </section>

      {/* STEPS */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-16 max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              How It Works
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Four simple steps to get charged.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              From finding a nearby charger to getting back on the
              road, HomeVolt keeps the entire process simple.
            </p>

          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="group relative rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                >

                  <div className="absolute right-6 top-6 text-4xl font-black text-slate-100">
                    {step.number}
                  </div>

                  <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* DRIVER + HOST */}

      <section className="border-y border-slate-100 bg-slate-50 px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-12 max-w-2xl text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Built For Everyone
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              One platform. Two sides of the network.
            </h2>

          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div className="rounded-3xl bg-slate-950 p-8 text-white md:p-10">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                <Car className="h-7 w-7" />
              </div>

              <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
                For EV Drivers
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Find charging when you need it.
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                Discover nearby charging points, check availability,
                reserve your slot, and get back on the road without
                unnecessary searching.
              </p>

              <div className="mt-8 space-y-3">

                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Verified charging points
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  Location-based discovery
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <CalendarCheck className="h-5 w-5 text-emerald-400" />
                  Easy slot booking
                </div>

              </div>

            </div>

            <div className="rounded-3xl bg-emerald-600 p-8 text-white md:p-10">

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <Home className="h-7 w-7" />
              </div>

              <p className="text-sm font-bold uppercase tracking-widest text-emerald-100">
                For Charging Hosts
              </p>

              <h3 className="mt-3 text-2xl font-black">
                Turn your charger into a community resource.
              </h3>

              <p className="mt-4 leading-7 text-emerald-50">
                Make your eligible charging setup available to EV
                owners and become part of a connected local charging
                network.
              </p>

              <div className="mt-8 space-y-3">

                <div className="flex items-center gap-3 text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  Verified host profiles
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Zap className="h-5 w-5" />
                  Manage charging availability
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Smartphone className="h-5 w-5" />
                  Manage everything digitally
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* WHY HOMEVOLT */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>

              <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Why HomeVolt
              </span>

              <h2 className="mt-3 text-3xl font-black md:text-4xl">
                More than just finding a charger.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                HomeVolt is designed around the complete charging
                experience — discovery, availability, booking, and
                community.
              </p>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-slate-200 p-6">
                <MapPin className="mb-4 h-7 w-7 text-blue-600" />
                <h3 className="font-bold">Nearby Locations</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Discover charging options around your journey.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <ShieldCheck className="mb-4 h-7 w-7 text-emerald-600" />
                <h3 className="font-bold">Verified Network</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Built around trusted charging hosts.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <CalendarCheck className="mb-4 h-7 w-7 text-blue-600" />
                <h3 className="font-bold">Simple Booking</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Reserve a charging slot before you arrive.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 p-6">
                <Zap className="mb-4 h-7 w-7 text-emerald-600" />
                <h3 className="font-bold">Keep Moving</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Spend less time searching and more time travelling.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* CTA */}

      <section className="px-6 pb-20">

        <div className="mx-auto max-w-6xl">

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-14 text-center text-white md:px-16">

            <h2 className="text-3xl font-black md:text-4xl">
              Ready to find your next charging point?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-50">
              Explore the HomeVolt network and discover charging
              options across your serviceable area.
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

    </main>
  );
}