"use client";
import { useState, useEffect, use } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  User,
  Trophy,
  Landmark,
} from "lucide-react";
import Link from "next/link";

export default function VerifyProtocol({ params }) {
  const { id } = use(params);
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const res = await fetch(
          `https://considerate-integrity-production.up.railway.app/api/protocol/${id}/verify`,
        );
        if (!res.ok) throw new Error("Bayonnoma topilmadi");
        const data = await res.json();
        setProtocol(data);
      } catch (err) {
        setError(err.message || "Bayonnoma topilmadi yoki u haqiqiy emas.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProtocol();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18436E] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-xl text-center space-y-6">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldCheck size={40} className="opacity-40" />
          </div>
          <h1 className="text-xl font-black text-gray-800 uppercase">
            Hujjat topilmadi
          </h1>
          <p className="text-gray-500 text-sm italic">{error}</p>
          <Link
            href="/"
            className="block w-full bg-[#18436E] text-white py-4 rounded-sm font-black uppercase tracking-widest text-xs"
          >
            ASOSIY SAHIFAGA QAYTISH
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 font-sans uppercase">
      <div className="max-w-xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#18436E] p-8 text-center text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 text-green-400 opacity-10 rotate-12">
            <ShieldCheck size={200} />
          </div>
          <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/20 shadow-lg animate-pulse">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Haqiqiylik Tasdiqlandi
          </h1>
          <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            TASDIQLANGAN ELEKTRON PROTOKOL
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Main Info */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <FileText size={14} className="text-blue-600" /> Bayonnoma
              ma'lumotlari
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-sm border border-gray-100">
                <span className="text-[10px] text-gray-500 font-black">
                  LOT №
                </span>
                <span className="font-black text-[#18436E] text-lg">
                  {protocol.lotData?.lotNumber}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-sm border border-gray-100">
                <span className="text-[10px] text-gray-500 font-black">
                  SAVDO SANASI
                </span>
                <span className="font-black text-[#18436E]">
                  {new Date(
                    protocol.lotData?.startDate || protocol.createdAt,
                  ).toLocaleDateString("uz-UZ")}
                </span>
              </div>
            </div>
          </div>

          {/* Lot Info */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <Landmark size={14} className="text-blue-600" /> Lot va Savdo
            </h2>
            <div className="p-5 bg-blue-50/30 rounded-sm border border-blue-100 space-y-4">
              <div>
                <span className="text-[9px] text-blue-400 font-black block mb-1">
                  OBYEKT NOMI
                </span>
                <p className="text-md font-black text-[#18436E]">
                  {protocol.lotData?.name}
                </p>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <span className="text-[9px] text-blue-400 font-black block mb-1">
                    LOT №
                  </span>
                  <span className="font-black text-[#18436E]">
                    {protocol.lotData?.lotNumber}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-blue-400 font-black block mb-1">
                    SOTILGAN NARXI
                  </span>
                  <span className="text-xl font-black text-green-600">
                    {protocol.finalPrice?.toLocaleString()} UZS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Winner Info */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <Trophy size={14} className="text-yellow-600" /> G'olib
              ma'lumotlari
            </h2>
            <div className="p-5 bg-gray-900 text-white rounded-sm space-y-4 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 p-3 rounded-sm text-yellow-400">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <span className="text-[9px] text-gray-500 font-black block mb-1">
                    G'OLIB NOMI
                  </span>
                  <p className="text-sm font-black tracking-tight leading-tight">
                    {protocol.winnerData?.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <div>
                  <span className="text-[9px] text-gray-500 font-black block mb-1">
                    Go'lib ma'lumotlari
                  </span>
                  <span className="text-xs font-bold text-gray-300">
                    {protocol.winnerData?.jshshir || "—"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-500 font-black block mb-1">
                    HUDUD
                  </span>
                  <span className="text-xs font-bold text-gray-300">
                    {protocol.winnerData?.address}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 space-y-4">
            <Link
              href="/"
              className="group block w-full bg-[#18436E] text-white text-center py-5 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-[#1e538a] transition-all flex items-center justify-center gap-3 shadow-lg"
            >
              ASOSIY SAHIFAGA QAYTISH
              <CheckCircle2
                size={16}
                className="text-green-400 group-hover:scale-125 transition-transform"
              />
            </Link>
            <div className="bg-orange-50 p-4 border border-orange-100 rounded-sm">
              <p className="text-[9px] text-orange-800 font-bold leading-relaxed text-center italic">
                DIQQAT! Ushbu sahifa bayonnomaning elektron nusxasi
                haqiqiyligini tasdiqlaydi. Bayonnomadagi ma'lumotlar bilan ushbu
                sahifa orasida nomuvofiqlik bo'lsa, hujjat haqiqiy emas deb
                hisoblanadi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
