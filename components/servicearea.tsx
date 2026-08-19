'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { MapPin, Search, Building2, MapPinOff, Milestone } from 'lucide-react';

interface CityItem {
  name: string;
  status: 'Live' | 'Next Phase';
}

interface RegionData {
  title: string;
  id: string;
  countLabel: string;
  cities: CityItem[];
}

export default function ServiceArea() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ city: '', state: '', profile: 'driver' });

  // 51 India Cities Data Matrix structured explicitly for HomeVolt
  const regions: RegionData[] = [
    {
      title: 'Delhi NCR & UK',
      id: 'north-ncr',
      countLabel: '9 Cities',
      cities: [
        { name: 'New Delhi', status: 'Live' },
        { name: 'Gurugram', status: 'Live' },
        { name: 'Noida', status: 'Live' },
        { name: 'Ghaziabad', status: 'Live' },
        { name: 'Faridabad', status: 'Live' },
        { name: 'Greater Noida', status: 'Live' },
        { name: 'Dehradun', status: 'Live' },
        { name: 'Haridwar', status: 'Live' },
        { name: 'Haldwani', status: 'Next Phase' },
      ],
    },
    {
      title: 'UP & East Metros',
      id: 'north-up-east',
      countLabel: '9 Cities',
      cities: [
        { name: 'Lucknow', status: 'Live' },
        { name: 'Kanpur', status: 'Live' },
        { name: 'Varanasi', status: 'Live' },
        { name: 'Prayagraj', status: 'Live' },
        { name: 'Agra', status: 'Live' },
        { name: 'Meerut', status: 'Live' },
        { name: 'Gorakhpur', status: 'Live' },
        { name: 'Patna', status: 'Live' },
        { name: 'Ranchi', status: 'Live' },
      ],
    },
    {
      title: 'PB, HR & Rajasthan',
      id: 'north-west',
      countLabel: '9 Cities',
      cities: [
        { name: 'Chandigarh', status: 'Live' },
        { name: 'Ludhiana', status: 'Live' },
        { name: 'Amritsar', status: 'Live' },
        { name: 'Jalandhar', status: 'Live' },
        { name: 'Ambala', status: 'Live' },
        { name: 'Karnal', status: 'Live' },
        { name: 'Jaipur', status: 'Live' },
        { name: 'Jodhpur', status: 'Live' },
        { name: 'Kota', status: 'Live' },
      ],
    },
    {
      title: 'West & Central Hubs',
      id: 'west-central',
      countLabel: '12 Cities',
      cities: [
        { name: 'Mumbai', status: 'Live' },
        { name: 'Pune', status: 'Live' },
        { name: 'Nagpur', status: 'Live' },
        { name: 'Nashik', status: 'Live' },
        { name: 'Thane', status: 'Live' },
        { name: 'Ahmedabad', status: 'Live' },
        { name: 'Surat', status: 'Live' },
        { name: 'Vadodara', status: 'Live' },
        { name: 'Indore', status: 'Live' },
        { name: 'Bhopal', status: 'Live' },
        { name: 'Gwalior', status: 'Live' },
        { name: 'Raipur', status: 'Live' },
      ],
    },
    {
      title: 'South & East Metros',
      id: 'south',
      countLabel: '12 Cities',
      cities: [
        { name: 'Bengaluru', status: 'Live' },
        { name: 'Chennai', status: 'Live' },
        { name: 'Hyderabad', status: 'Live' },
        { name: 'Kolkata', status: 'Live' },
        { name: 'Kochi', status: 'Live' },
        { name: 'Coimbatore', status: 'Live' },
        { name: 'Visakhapatnam', status: 'Live' },
        { name: 'Vijayawada', status: 'Live' },
        { name: 'Madurai', status: 'Live' },
        { name: 'Bhubaneswar', status: 'Live' },
        { name: 'Guwahati', status: 'Live' },
        { name: 'Jamshedpur', status: 'Live' },
      ],
    },
  ];

  const filterButtons = [
    { label: 'All 51 Cities', id: 'all' },
    { label: 'Delhi NCR & North', id: 'north-ncr' },
    { label: 'UP & East', id: 'north-up-east' },
    { label: 'Punjab, HR & Raj', id: 'north-west' },
    { label: 'West & Central', id: 'west-central' },
    { label: 'Southern Metros', id: 'south' },
  ];

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ city: '', state: '', profile: 'driver' });
    }, 4000);
  };

  // Compute live visible filter/search metrics
  let totalVisibleMatches = 0;

  const processedRegions = regions
    .map((region) => {
      // Filter out regions entirely if structural categorical selection does not align
      if (activeFilter !== 'all' && region.id !== activeFilter) {
        return { ...region, cities: [] };
      }

      // Filter individual nested cities based on real-time typing query
      const filteredCities = region.cities.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );

      totalVisibleMatches += filteredCities.length;

      return { ...region, cities: filteredCities };
    })
    .filter((region) => region.cities.length > 0);

  return (
    <div className="bg-gray-50 text-gray-900 font-sans antialiased min-h-screen flex flex-col">
      <main className="flex-grow">
        
        {/* 1. Hero Search Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium px-3 py-1 rounded-full border border-emerald-500/20 mb-4">
              <MapPin className="w-4 h-4" /> Pan-India Network
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Find a HomeVolt Charger Near You
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              Connecting EV owners with verified community hosting setups across 51 major Indian metropolises and highway corridors.
            </p>

          </div>
        </section>

        {/* 2. Top Tier-1 Metric Highlights */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold mb-2">Our Highest Demand Hubs</h2>
          <p className="text-slate-600 mb-8">Maximum cluster of verified residential hosts and fast community chargers.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Delhi NCR', region: 'National Capital Region', hosts: '450+' },
              { name: 'Mumbai ', region: 'Financial Capital Hub', hosts: '380+' },
              { name: 'Bengaluru', region: 'Tech Corridor', hosts: '510+' },
              { name: 'Kolkata', region: 'Eastern Gateway', hosts: '190+' },
            ].map((hub, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-1">{hub.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{hub.region}</p>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg">
                  <span>{hub.hosts} Hosts</span>
                  <span className="text-emerald-600">Active Network</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Filter Grid Engine */}
        <section className="bg-white border-y border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold">Serviceable Cities Breakdown</h2>
                <p className="text-slate-600">Directly explore or filter operational status among major clusters.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {filterButtons.map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => {
                      setActiveFilter(btn.id);
                      setSearchQuery(''); // Flush query on clean tab change
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      activeFilter === btn.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {totalVisibleMatches > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {processedRegions.map((region) => (
                  <div key={region.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-lg border-b border-slate-200 pb-2 mb-3 text-emerald-800 flex justify-between items-center">
                      <span>{region.title}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm">
                        {region.countLabel}
                      </span>
                    </h3>
                    <ul className="space-y-2 text-slate-700 text-sm font-medium">
                      {region.cities.map((city, cIdx) => (
                        <li key={cIdx} className="flex justify-between items-center">
                          <span>{city.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              city.status === 'Live'
                                ? 'text-emerald-600 bg-emerald-50'
                                : 'text-amber-600 bg-amber-50'
                            }`}
                          >
                            {city.status}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPinOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">We couldn't find a matching city in our active grid yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}