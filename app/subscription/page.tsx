// Location: components/pricingplan.tsx
'use client';

import React, { useState } from 'react';

export default function PricingPlan() {
  const [loading, setLoading] = useState(false);

  const perks = [
    { text: 'Discounted charging rates across 51 cities', highlighted: true },
    { text: 'Complimentary residential vehicle pickup & drop' },
    { text: 'Priority queuing at high-demand highway hubs' },
    { text: 'Zero automated reservation cancellation fees' },
    { text: '24/7 dedicated roadside emergency breakdown assistance' },
    { text: 'Share plan access with up to 2 family vehicles' }
  ];

  const handleCheckout = async () => {
    setLoading(true);
    // Integrate API Gateway routes here (Stripe, Razorpay, etc.)
    setTimeout(() => {
      alert('⚡ Redirecting to HomeVolt secure payment gateway portal...');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-sans antialiased py-20 px-4 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            Premium Access Pass
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
            One Membership. Ultimate EV Freedom.
          </h2>
          <p className="text-slate-600 text-sm md:text-base">
            Unlock premium door-to-door logistics, cheaper power grids, and elite priority routing lanes all across India.
          </p>
        </div>

        {/* Pricing Card Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden max-w-lg mx-auto transform hover:scale-[1.01] transition-transform duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white p-8 relative">
            <div className="absolute top-6 right-6 bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-1 tracking-tight">HomeVolt Pro Tier</h3>
            <p className="text-slate-400 text-xs mb-6">Designed for regular daily commuters and fleet drivers.</p>
            
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight">₹399</span>
              <span className="text-slate-400 text-sm font-medium">/ month</span>
            </div>
          </div>

          {/* Perks Feature Checklist */}
          <div className="p-8 bg-white">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Included Premium Benefits</h4>
            
            <ul className="space-y-4 mb-8">
              {perks.map((perk, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <span className="mt-0.5 text-emerald-600 bg-emerald-50 rounded-full p-0.5 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  <span className={perk.highlighted ? "text-slate-900 font-semibold" : ""}>
                    {perk.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* Action Checkout Trigger Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold py-4 px-6 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Activate Membership Now</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </>
              )}
            </button>

            {/* Secure Payment Badges */}
            <p className="text-[11px] text-slate-400 text-center mt-4 flex items-center justify-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Secured via standard PCI-DSS gateways. Cancel anytime in one-click.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}