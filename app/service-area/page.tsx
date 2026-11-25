'use client';

import React from 'react';
import { MapPin, Building2, ArrowRight } from 'lucide-react';
import Navbar from '@/components/navbar';

interface CityItem {
  name: string;
  status: 'Live' | 'Next Phase';
}

export default function ServiceArea() {
  const delhiNCR: CityItem[] = [
    { name: 'New Delhi', status: 'Live' },
    { name: 'Sonipat', status: 'Live' },
    { name: 'Gurugram', status: 'Live' },
    { name: 'Noida', status: 'Live' },
    { name: 'Ghaziabad', status: 'Live' },
    { name: 'Faridabad', status: 'Next Phase' },
    { name: 'Greater Noida', status: 'Next Phase' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">

      {/* FIXED NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="pt-[76px]">

        {/* HERO */}
        <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-4 py-20 text-center text-white md:py-24">

          <div className="mx-auto max-w-4xl">

            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              <MapPin className="h-4 w-4" />
              Delhi NCR Network
            </span>

            <h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Find a HomeVolt Charger Near You
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-300">
              Connecting EV owners with verified community charging setups
              across the Delhi NCR region.
            </p>

          </div>

        </section>

        {/* SERVICE AREA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="mb-10">

            <span className="text-sm font-bold uppercase tracking-wider text-emerald-600">
              Our Service Area
            </span>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Delhi NCR Service Area
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Explore HomeVolt&apos;s charging network across Delhi NCR and
              surrounding cities.
            </p>

          </div>

          {/* DELHI NCR CARD */}
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-8 md:p-10">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Building2 className="h-8 w-8" />
                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-slate-900">
                      Delhi NCR
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      National Capital Region
                    </p>

                  </div>

                </div>

                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Network Active
                </div>

              </div>

            </div>

            {/* CITIES */}
            <div className="p-8 md:p-10">

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {delhiNCR.map((city) => (

                  <div
                    key={city.name}
                    className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:bg-white hover:shadow-md"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <span className="font-semibold text-slate-700">
                        {city.name}
                      </span>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                        city.status === 'Live'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {city.status}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* NETWORK CTA */}
        <section className="border-y border-slate-100 bg-white py-16">

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white md:p-12">

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

                <div className="max-w-2xl">

                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-emerald-400">
                    HomeVolt Network
                  </p>

                  <h2 className="text-2xl font-bold leading-tight md:text-3xl">
                    Powering EV journeys across Delhi NCR
                  </h2>

                  <p className="mt-3 leading-7 text-slate-400">
                    Find verified community charging points and make your EV
                    journey easier, faster, and more convenient.
                  </p>

                </div>

                <a
                  href="/"
                  className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-slate-900 transition-all hover:bg-emerald-50"
                >
                  Explore Chargers
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}