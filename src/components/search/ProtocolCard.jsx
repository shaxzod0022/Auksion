"use client";
import React from "react";
import Link from "next/link";
import { FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { styles } from "@/styles/styles";

const API_BASE_URL = "https://considerate-integrity-production.up.railway.app";

export default function ProtocolCard({ protocol }) {
  const lotData = protocol.isManual ? protocol.manualData : protocol.lot;
  const lotNumber = protocol.manualData?.lotNumber || lotData?.lotNumber;
  const lotName = protocol.manualData?.description || lotData?.name;

  return (
    <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-blue-50 p-3 rounded-sm text-[#18436E]">
          <FileText size={24} />
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-sm uppercase tracking-widest">
            Bayonnoma Tasdiqlangan
          </span>
          <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold">
            № {protocol.protocolNumber}
          </p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div>
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">
            Lot Raqami
          </span>
          <p className="font-black text-[#18436E] text-lg">#{lotNumber}</p>
        </div>
        <div>
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">
            Obyekt
          </span>
          <p className="font-bold text-gray-800 text-sm line-clamp-2">
            {lotName}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 size={16} />
          <span className="text-[10px] font-black uppercase tracking-wider">
            Haqiqiy
          </span>
        </div>
        <a
          href={`${API_BASE_URL}/api/protocol/${protocol._id}/download`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#18436E] hover:text-blue-700 font-black text-[10px] uppercase tracking-widest transition-colors group"
        >


          Ko'rish
          <ArrowRight
            size={14}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>

      </div>
    </div>
  );
}
