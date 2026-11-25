"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Zap,
  MapPin,
  CreditCard,
  UserRound,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What is HomeVolt?",
    answer:
      "HomeVolt is a community-powered EV charging platform that connects EV drivers with available charging points and makes EV charging more convenient.",
  },
  {
    question: "How does HomeVolt work?",
    answer:
      "Find a nearby charging point, check its availability, select a suitable time slot, and book your charging session through HomeVolt.",
  },
  {
    question: "How do I find a charging station?",
    answer:
      "Use the HomeVolt service area or charging map to explore available charging points around your location or journey.",
  },
  {
    question: "Can I book a charging slot?",
    answer:
      "Yes. When booking is available for a charging point, you can select an available time slot and reserve it before reaching the location.",
  },
  {
    question: "Can I become a charging host?",
    answer:
      "Yes. Eligible users can participate as charging hosts and make their charging setup available to EV drivers through HomeVolt.",
  },
  {
    question: "How does payment work?",
    answer:
      "Payment details depend on the charging service and booking option available through HomeVolt. Applicable pricing is shown before confirming a reservation.",
  },
  {
    question: "Which cities does HomeVolt support?",
    answer:
      "HomeVolt is expanding its charging network across serviceable areas. Visit the Serviceable Area page to see the currently supported locations.",
  },
  {
    question: "What if I cannot find a charger near me?",
    answer:
      "You can check the HomeVolt service area periodically as the charging network continues to expand.",
  },
];

const categories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Learn how HomeVolt works.",
  },
  {
    icon: MapPin,
    title: "Charging & Locations",
    description: "Find chargers and service areas.",
  },
  {
    icon: CreditCard,
    title: "Bookings & Payments",
    description: "Understand bookings and payments.",
  },
  {
    icon: UserRound,
    title: "Hosts & Accounts",
    description: "Information for drivers and hosts.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="w-full min-h-screen bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="w-full bg-gradient-to-br from-[#071126] via-[#0c172b] to-[#003b32] px-6 pt-[135px] pb-24 text-white sm:pt-[145px] sm:pb-28">

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">

          {/* Badge */}

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 text-sm font-semibold text-blue-400">

            <HelpCircle className="h-5 w-5" />

            HomeVolt Support

          </div>

          {/* Heading */}

          <h1 className="max-w-5xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">

            Frequently Asked

            <span className="block text-blue-500">
              Questions.
            </span>

          </h1>

          {/* Description */}

          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-300 sm:text-xl md:text-2xl">

            Everything you need to know about finding chargers,
            booking slots, using HomeVolt, and joining our EV
            charging community.

          </p>

        </div>

      </section>

      {/* =====================================================
          HELP CATEGORIES
      ===================================================== */}

      <section className="w-full bg-white px-6 py-20">

        <div className="mx-auto w-full max-w-7xl">

          <div className="mb-12 text-center">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Help Center
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              How can we help?
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Find answers about charging, bookings, locations,
              accounts, and the HomeVolt network.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <div
                  key={category.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                    <Icon className="h-6 w-6" />

                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {category.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {category.description}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          FAQ SECTION
      ===================================================== */}

      <section className="w-full bg-slate-50 px-6 py-20">

        <div className="mx-auto w-full max-w-5xl">

          <div className="mb-12">

            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Frequently Asked Questions
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Everything you need to know.
            </h2>

          </div>

          <div className="space-y-4">

            {faqs.map((faq, index) => {

              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition hover:bg-slate-50"
                  >

                    <span className="text-base font-bold text-slate-900 sm:text-lg">
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >

                      <ChevronDown
                        className={`h-5 w-5 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />

                    </span>

                  </button>

                  {isOpen && (

                    <div className="border-t border-slate-100 px-6 pb-6 pt-5">

                      <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                        {faq.answer}
                      </p>

                    </div>

                  )}

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="w-full bg-white px-6 py-20">

        <div className="mx-auto w-full max-w-7xl">

          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-14 text-center text-white sm:px-12">

            <h2 className="text-3xl font-black sm:text-4xl">
              Ready to power your journey?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-blue-50">
              Explore the HomeVolt network and find charging
              options around your journey.
            </p>

            <a
              href="/service-area"
              className="mt-8 inline-flex rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-lg transition hover:bg-slate-100"
            >
              Explore Service Area
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}