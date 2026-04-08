import { LotHero, LotDetailClient, AboutUs } from "@/components";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const res = await fetch(
      `https://auksion-backend-production.up.railway.app/api/lot/slug/${slug}`,
    );
    const lot = await res.json();

    return {
      title: `${lot.name} - Universal Auksion`,
      description: lot.description?.substring(0, 160),
    };
  } catch (error) {
    return { title: "Lot ma'lumotlari - Universal Auksion" };
  }
}

export default async function LotDetailPage({ params }) {
  const { slug } = await params;

  const fetchLotData = async () => {
    try {
      const res = await fetch(
        `https://auksion-backend-production.up.railway.app/api/lot/slug/${slug}`,
        {
          next: { revalidate: 60 },
        },
      );
      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Error fetching lot details:", error);
      return null;
    }
  };

  const lot = await fetchLotData();

  if (!lot) {
    return (
      <main className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-10">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="text-2xl font-black text-[#18436E] mb-4 uppercase">
            Lot topilmadi
          </h1>
          <p className="text-gray-500 mb-8">
            Siz qidirayotgan lot o'chirilgan yoki manzili noto'g'ri kiritilgan
            bo'lishi mumkin.
          </p>
          <Link
            href="/lots/lots"
            className="bg-[#18436E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#18436E]/90 transition-all"
          >
            Barcha lotlarga qaytish
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-200 min-h-screen">
      <LotHero title={lot.name} image={lot.image} />

      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-10">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/lots/lots"
            className="inline-flex items-center gap-2 text-[#18436E] font-bold hover:underline group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Barcha lotlar
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Kategoriya:
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-[#18436E] border border-gray-100 shadow-sm uppercase">
              {lot.category?.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-8 mb-4">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-black text-[#18436E] uppercase tracking-tighter leading-[0.9]">
              {lot.name}
            </h1>
            <p className="text-gray-400 font-bold tracking-[0.3em] text-xs uppercase px-1">
              ID: {lot.lotNumber} • SHAKLI: {lot.lotType?.name || "Auksion"}
            </p>
          </div>
        </div>

        <LotDetailClient lot={lot} />
      </div>

      <AboutUs />
    </main>
  );
}
