
'use client';

import React, { useEffect, useState } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

export default function PricingPlan() {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('upi');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const storedUserId =
      localStorage.getItem('userId') ||
      localStorage.getItem('user_id') ||
      localStorage.getItem('id') ||
      '';

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const perks = [
    {
      text: 'Discounted charging rates across 51 cities',
      highlighted: true,
    },
    { text: 'Complimentary residential vehicle pickup & drop' },
    { text: 'Priority queuing at high-demand highway hubs' },
    { text: 'Zero automated reservation cancellation fees' },
    {
      text: '24/7 dedicated roadside emergency breakdown assistance',
    },
    { text: 'Share plan access with up to 2 family vehicles' },
  ];

  const handleCheckout = async () => {
    setError('');
    setMessage('');

    if (!userId.trim()) {
      setError('Please enter your User ID to activate your membership.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/subscriptions/activate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId.trim(),
            paymentMethod,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || 'Unable to activate membership.'
        );
      }

      setIsActive(true);
      setMessage(
        data.message ||
          'Your HomeVolt Pro membership has been activated successfully!'
      );
      setShowPaymentModal(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    if (!userId.trim()) {
      setError('Please enter your User ID first.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/subscriptions/${encodeURIComponent(userId.trim())}`
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || data.message || 'Unable to check subscription status.'
        );
      }

      const active =
        data.status === 'active' ||
        data.subscription?.status === 'active' ||
        data.active === true;

      setIsActive(active);
      setMessage(
        active
          ? 'Your HomeVolt Pro membership is active.'
          : 'No active membership was found for this account.'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to check your subscription.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20 font-sans text-gray-900 antialiased">
      <div className="w-full max-w-4xl">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-blue-600">
            Premium Access Pass
          </span>

          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            One Membership. Ultimate EV Freedom.
          </h2>

          <p className="text-sm text-slate-600 md:text-base">
            Unlock premium door-to-door logistics, cheaper power grids, and
            elite priority routing lanes all across India.
          </p>
        </div>

        <div className="mx-auto max-w-lg transform overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl transition-transform duration-300 hover:scale-[1.01]">
          <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-8 text-white">
            <div className="absolute right-6 top-6 rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-sm">
              Most Popular
            </div>

            <h3 className="mb-1 text-xl font-bold tracking-tight">
              HomeVolt Pro Tier
            </h3>

            <p className="mb-6 text-xs text-slate-400">
              Designed for regular daily commuters and fleet drivers.
            </p>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight">
                ₹399
              </span>
              <span className="text-sm font-medium text-slate-400">
                / month
              </span>
            </div>
          </div>

          <div className="bg-white p-8">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">
              Included Premium Benefits
            </h4>

            <ul className="mb-8 space-y-4">
              {perks.map((perk, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm font-medium text-slate-700"
                >
                  <span className="mt-0.5 shrink-0 rounded-full bg-emerald-50 p-0.5 text-emerald-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>

                  <span
                    className={
                      perk.highlighted
                        ? 'font-semibold text-slate-900'
                        : ''
                    }
                  >
                    {perk.text}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setError('');
                setMessage('');
                setShowPaymentModal(true);
              }}
              disabled={loading || isActive}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isActive ? (
                <span>Membership Active ✓</span>
              ) : (
                <>
                  <span>Activate Membership Now</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </>
              )}
            </button>

            <button
              onClick={checkSubscription}
              disabled={loading}
              className="mt-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Check Membership Status
            </button>

            {message && (
              <div
                role="status"
                className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
              >
                {message}
              </div>
            )}

            {error && !showPaymentModal && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Demo payment only. No real money is charged.
            </p>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-title"
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3
                  id="payment-title"
                  className="text-2xl font-black text-slate-900"
                >
                  Complete Membership
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Choose a demo payment method to activate your plan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                disabled={loading}
                aria-label="Close payment dialog"
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  HomeVolt Pro
                </span>
                <span className="text-xl font-black text-slate-900">
                  ₹399
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Monthly membership · Simulated payment
              </p>
            </div>

            <label
              htmlFor="userId"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              User ID
            </label>

            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
              placeholder="Enter your registered User ID"
              className="mb-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mb-3 text-sm font-semibold text-slate-700">
              Select Payment Method
            </p>

            <div className="space-y-3">
              {[
                {
                  value: 'upi',
                  title: 'UPI',
                  description: 'Demo UPI payment',
                  icon: '📱',
                },
                {
                  value: 'card',
                  title: 'Debit / Credit Card',
                  description: 'Demo card payment',
                  icon: '💳',
                },
                {
                  value: 'netbanking',
                  title: 'Net Banking',
                  description: 'Demo net banking payment',
                  icon: '🏦',
                },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() =>
                      setPaymentMethod(method.value as PaymentMethod)
                    }
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span className="text-xl">{method.icon}</span>

                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {method.title}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {method.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || !userId.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Activating Membership...
                </>
              ) : (
                'Confirm & Activate — ₹399'
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              This is a simulated payment flow. No real payment gateway is used.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}