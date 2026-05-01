"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Hash, ArrowRight, FileText } from "lucide-react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Check if query looks like a number (lot or protocol)
    // For now, we redirect to the unified search page for all queries
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 py-0 px-4">
      <div className="bg-white rounded-md shadow-2xl shadow-blue-900/10 p-4 md:p-8 border border-white backdrop-blur-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6"
        >
          {/* Unified Search Input */}
          <div className="flex-1 group">
            <label className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.2em] mb-2 block px-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
              Lot raqami, Bayonnoma yoki Kalit so'z
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#18436E] group-focus-within:bg-[#18436E] group-focus-within:text-white transition-all duration-300">
                {query.match(/^\d+$/) ? <Hash size={18} /> : <Search size={18} />}
              </div>
              <input
                type="text"
                placeholder="Masalan: 12345678 yoki 'Spark'..."
                className="w-full pl-16 pr-4 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#18436E]/10 focus:ring-4 focus:ring-[#18436E]/5 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="lg:pt-6">
            <button
              type="submit"
              className="w-full lg:w-auto bg-[#18436E] hover:bg-[#1e538a] text-white font-black px-12 py-5 rounded-sm shadow-xl shadow-blue-900/20 transition-all active:scale-95 group flex items-center justify-center gap-3 cursor-pointer"
            >
              <span className="uppercase tracking-widest text-sm">
                Qidirish
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-6 flex flex-wrap items-center gap-6 px-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Mashhur so'rovlar:
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {["Yengil avto", "Ko'chmas mulk", "Qishloq xo'jaligi"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="text-[10px] font-bold text-[#18436E]/60 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-blue-100"
              >
                {tag}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-4 ml-auto border-l border-gray-100 pl-6">
             <div className="flex items-center gap-2 text-green-600 opacity-60">
                <FileText size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">Bayonnomalar qidiruvi faol</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
