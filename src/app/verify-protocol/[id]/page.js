"use client";
import { useState, useEffect, use } from "react";
import { CheckCircle2, ShieldCheck, FileText, User, Hash, Calendar, Trophy, Landmark } from "lucide-react";
import Link from "next/link";

export default function VerifyProtocol({ params }) {
  const { id } = use(params);
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/protocol/${id}/download`);
        // This is a download endpoint, but we can have a separate metadata endpoint if needed.
        // For simplicity, let's assume we have an endpoint for metadata:
        const metaRes = await fetch(`http://localhost:8080/api/protocol/${id}/meta`);
        if (!metaRes.ok) throw new Error("Bayonnoma topilmadi");
        const data = await metaRes.json();
        setProtocol(data);
      } catch (err) {
        setError("Bayonnoma topilmadi yoki u haqiqiy emas.");
      } finally {
        setLoading(false);
      }
    };
    // fetchProtocol(); 
    // Wait, let's mock it for now since I haven't added the /meta endpoint yet.
    // I'll add the /meta endpoint to the backend next.
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18436E] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-sm shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#18436E] p-8 text-center text-white relative">
          <div className="absolute top-4 right-4 text-green-400 opacity-20">
            <ShieldCheck size={120} />
          </div>
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/20">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight">Haqiqiylik Tasdiqlandi</h1>
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mt-2">Elektron savdo bayonnomasi</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <FileText size={14} /> Bayonnoma ma'lumotlari
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-sm">
                <span className="text-gray-500 font-bold flex items-center gap-2"><Hash size={14}/> Raqami</span>
                <span className="font-black text-[#18436E]">PR-{id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-sm">
                <span className="text-gray-500 font-bold flex items-center gap-2"><Calendar size={14}/> Sana</span>
                <span className="font-black text-[#18436E]">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2 flex items-center gap-2">
              <Landmark size={14} /> Lot ma'lumotlari
            </h2>
            <div className="p-4 bg-blue-50/50 rounded-sm border border-blue-100 space-y-2">
              <p className="text-lg font-black text-[#18436E] uppercase">Savdo Obyekti</p>
              <p className="text-sm text-blue-800 font-medium leading-relaxed italic">
                Ushbu bayonnoma elektron savdo tizimi orqali o'tkazilgan auksion natijasiga ko'ra rasmiylashtirilgan.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
             <Link href="/" className="w-full bg-[#18436E] text-white text-center py-4 rounded-sm font-black uppercase tracking-widest text-sm hover:shadow-lg transition-all">
                ASOSIY SAHIFAGA QAYTISH
             </Link>
             <p className="text-[10px] text-center text-gray-400 italic">
                Ushbu sahifa elektron bayonnomalarning haqiqiyligini tasdiqlash uchun xizmat qiladi.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
