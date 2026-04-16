"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Hash, ArrowRight } from "lucide-react";

export default function HomeSearchBar() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    lotNumber: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!formData.lotNumber && !formData.name) return;

    const query = new URLSearchParams();
    if (formData.lotNumber) query.set("lotNumber", formData.lotNumber);
    if (formData.name) query.set("name", formData.name);

    router.push(`/lots/lots?${query.toString()}`);
  };

  return (
    <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 py-0 px-4">
      <div className="bg-white rounded-md shadow-2xl shadow-blue-900/10 p-4 md:p-8 border border-white backdrop-blur-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6"
        >
          {/* Lot Number Input */}
          <div className="flex-1 group">
            <label className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.2em] mb-2 block px-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
              Lot raqami
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#18436E] group-focus-within:bg-[#18436E] group-focus-within:text-white transition-all duration-300">
                <Hash size={18} />
              </div>
              <input
                type="text"
                name="lotNumber"
                placeholder="Masalan: 12345678"
                className="w-full pl-16 pr-4 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#18436E]/10 focus:ring-4 focus:ring-[#18436E]/5 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                value={formData.lotNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Separator Line (Desktop only) */}
          <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-gray-100 to-transparent self-end mb-1" />

          {/* Lot Name Input */}
          <div className="flex-[1.5] group">
            <label className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.2em] mb-2 block px-2 opacity-50 group-focus-within:opacity-100 transition-opacity">
              Mulk nomi yoki kalit so'z
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#18436E] group-focus-within:bg-[#18436E] group-focus-within:text-white transition-all duration-300">
                <Search size={18} />
              </div>
              <input
                type="text"
                name="name"
                placeholder="Nima qidiryapsiz? (Masalan: Uy, Spark, ...) "
                className="w-full pl-16 pr-4 py-5 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#18436E]/10 focus:ring-4 focus:ring-[#18436E]/5 outline-none transition-all text-gray-800 placeholder:text-gray-300 font-medium"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="lg:pt-6">
            <button
              type="submit"
              className="w-full lg:w-auto bg-[#18436E] hover:bg-[#1e538a] text-white font-black px-10 py-5 rounded-sm shadow-xl shadow-blue-900/20 transition-all active:scale-95 group flex items-center justify-center gap-3 cursor-pointer"
            >
              <span className="uppercase tracking-widest text-sm">
                Qidirish
              </span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        {/* Quick Tips */}
        <div className="mt-6 flex flex-wrap items-center gap-4 px-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Mashhur so'rovlar:
          </span>
          {["Yengil avto", "Ko'chmas mulk", "Qishloq xo'jaligi"].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setFormData((prev) => ({ ...prev, name: tag }));
                // Trigger search immediately if desired
              }}
              className="text-[10px] font-bold text-[#18436E]/60 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
