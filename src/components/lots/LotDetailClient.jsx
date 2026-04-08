"use client";

import { useState, useEffect } from "react";
import { styles } from "@/styles/styles";
import {
  Calendar,
  Clock,
  Landmark,
  User,
  MapPin,
  Phone,
  History,
  Info,
  Layers,
  HandCoins,
} from "lucide-react";

export default function LotDetailClient({ lot }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = new Date(lot.startDate).getTime() - now;

      if (distance < 0) {
        return null;
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [lot.startDate]);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#18436E] group-hover:bg-[#18436E] group-hover:text-white transition-all">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-gray-500 font-medium">{label}</span>
      </div>
      <span className="text-[#18436E] font-bold text-right">{value}</span>
    </div>
  );

  if (!isMounted) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-10">
      {/* Left Column - Main Content */}
      <div className="flex-1 space-y-8">
        <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-900/5 overflow-hidden group">
          <img
            src={`https://auksion-backend-production.up.railway.app/upload/${lot.image}`}
            alt={lot.name}
            className="w-full h-auto aspect-video object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Description Section */}
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#18436E]">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#18436E] uppercase tracking-tight">
              Lot Tavsifi
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {lot.description}
          </p>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-[#18436E]">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-[#18436E] uppercase tracking-tight">
              Texnik Ma'lumotlar
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <InfoRow icon={Landmark} label="Lot raqami" value={lot.lotNumber} />
            <InfoRow icon={History} label="Savdo turi" value={lot.formTrade} />
            <InfoRow icon={User} label="Buyurtmachi" value={lot.customer} />
            <InfoRow icon={MapPin} label="Viloyat" value={lot.province?.name} />
            <InfoRow icon={MapPin} label="Tuman" value={lot.region?.name} />
            <InfoRow
              icon={MapPin}
              label="Manzil"
              value={lot.address || "Ko'rsatilmagan"}
            />
            <InfoRow
              icon={HandCoins}
              label="Savdo hajmi"
              value={`${lot.salesVolume?.toLocaleString()} ${lot.style === "ko'chmas mulk" ? "m²" : "dona"}`}
            />
            <InfoRow icon={Phone} label="Bog'lanish" value={lot.phone1} />
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="lg:w-[400px] shrink-0 space-y-6">
        {/* Countdown Timer Card */}
        <div className="bg-[#18436E] p-8 rounded-2xl shadow-2xl text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clock className="w-20 h-20 rotate-12" />
          </div>
          <h4 className="text-blue-200 uppercase font-black tracking-widest text-sm mb-4">
            Auksion boshlanishiga
          </h4>
          {timeLeft ? (
            <div className="flex justify-between items-center gap-2">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <span className="block text-3xl font-black">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-200">
                  Kun
                </span>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <span className="block text-3xl font-black">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-200">
                  Soat
                </span>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <span className="block text-3xl font-black">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-200">
                  Daq
                </span>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <span className="block text-3xl font-black">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] uppercase font-bold text-blue-200">
                  Soniya
                </span>
              </div>
            </div>
          ) : (
            <p className="text-2xl font-black text-red-300">
              Savdo yakunlangan!
            </p>
          )}
        </div>

        {/* Pricing Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-full space-y-6">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100 mb-4">
              <span className="block text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">
                Boshlang'ich narx
              </span>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-4xl font-black text-[#18436E]">
                  {lot.startPrice?.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#18436E]">SO'M</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider">
                  Auksion qadami
                </span>
                <span className="text-[#18436E] font-black">
                  {lot.firstStep?.toLocaleString()} so'm
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider">
                  Xizmat narxi
                </span>
                <span className="text-[#18436E] font-black">
                  {lot.consultationPrice?.toLocaleString()} so'm
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-wider">
                  Ko'rishlar
                </span>
                <span className="text-[#18436E] font-black">{lot.views}</span>
              </div>
            </div>

            <button className="w-full bg-[#18436E] hover:bg-[#18436E]/90 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-3 active:scale-95">
              SAVDOGA QO'SHILISH
            </button>
          </div>
        </div>

        {/* Dates Card */}
        <div className="bg-gray-100/50 p-6 rounded-2xl border border-dashed border-gray-300">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="font-black text-gray-700 uppercase tracking-tight">
              Muhim muddatlar
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Savdo boshi
              </span>
              <span className="text-sm font-bold text-[#18436E]">
                {new Date(lot.startDate).toLocaleDateString("uz-UZ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase">
                Savdo yakuni
              </span>
              <span className="text-sm font-bold text-red-500">
                {new Date(lot.endDate).toLocaleDateString("uz-UZ")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
