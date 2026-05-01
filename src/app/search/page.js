"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, AlertCircle, FileText, Package } from "lucide-react";
import Link from "next/link";
import { styles } from "@/styles/styles";
import ProtocolCard from "@/components/search/ProtocolCard";

const API_BASE_URL = "https://considerate-integrity-production.up.railway.app";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({ lots: [], protocols: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/search?q=${query}`);
        if (!res.ok) throw new Error("Qidiruvda xatolik yuz berdi");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#18436E] animate-spin" />
        <p className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.3em] animate-pulse">
          Qidirilmoqda...
        </p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <Search size={48} className="text-gray-400" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-2">
          Qidiruv so'rovi yo'q
        </h1>
        <p className="text-gray-500 text-sm italic max-w-md">
          Lot raqami yoki kalit so'zni kiriting.
        </p>
        <Link
          href="/"
          className="mt-8 bg-[#18436E] text-white px-8 py-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-[#1e538a] transition-all"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const hasResults = results.lots.length > 0 || results.protocols.length > 0;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-100 py-4">
        <div className={styles.paddingCont}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                Qidiruv natijalari
              </h1>
              <p className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="opacity-50">So'rov:</span>
                <span className="bg-blue-50 px-2 py-0.5 rounded-sm">
                  {query}
                </span>
              </p>
            </div>
            <div className="flex gap-4">
              <div className="bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 flex items-center gap-3">
                <Package size={16} className="text-blue-600" />
                <span className="text-xs font-black text-gray-700">
                  {results.lots.length} Lotlar
                </span>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 flex items-center gap-3">
                <FileText size={16} className="text-green-600" />
                <span className="text-xs font-black text-gray-700">
                  {results.protocols.length} Bayonnomalar
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {!hasResults ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white mx-auto max-w-4xl rounded-sm border border-dashed border-gray-200">
          <AlertCircle size={48} className="text-orange-400 mb-4" />
          <h2 className="text-xl font-black text-gray-800 uppercase">
            Hech narsa topilmadi
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Boshqa lot raqami yoki so'z kiriting.
          </p>
        </div>
      ) : (
        <div className={styles.paddingCont}>
          {/* Protocols Section */}
          {results.protocols.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gray-200 flex-1" />
                <h2 className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.4em] flex items-center gap-2">
                  <FileText size={14} /> Bayonnomalar
                </h2>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.protocols.map((protocol) => (
                  <ProtocolCard key={protocol._id} protocol={protocol} />
                ))}
              </div>
            </section>
          )}

          {/* Lots Section */}
          {results.lots.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-gray-200 flex-1" />
                <h2 className="text-[10px] font-black text-[#18436E] uppercase tracking-[0.4em] flex items-center gap-2">
                  <Package size={14} /> Lotlar
                </h2>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.lots.map((item) => (
                  <Link
                    href={`/lots/${item.slug}`}
                    key={item._id}
                    className="bg-white p-3 rounded-sm shadow-sm hover:shadow-md transition-shadow group border border-gray-50"
                  >
                    <div className="relative overflow-hidden aspect-video rounded-sm mb-4">
                      <img
                        src={`${API_BASE_URL}/upload/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-[#18436E] text-white px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-wider shadow-lg">
                        {item.category?.name}
                      </div>
                    </div>
                    <div className="space-y-4 px-2 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-black text-gray-800 text-sm uppercase leading-tight line-clamp-2">
                          {item.name}
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 shrink-0">
                          #{item.lotNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-end border-t border-gray-50 pt-4">
                        <div className="space-y-1">
                          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                            Boshlang'ich narx
                          </p>
                          <p className="text-sm font-black text-[#18436E]">
                            {item.startPrice.toLocaleString()} SO'M
                          </p>
                        </div>
                        <div className="bg-blue-50 text-[#18436E] p-2 rounded-sm group-hover:bg-[#18436E] group-hover:text-white transition-colors">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

const ArrowRight = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default function SearchPage() {
  return (
    <main className="bg-gray-50 min-h-screen font-sans uppercase">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin" />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </main>
  );
}
