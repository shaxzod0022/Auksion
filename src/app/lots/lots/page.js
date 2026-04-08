import { AboutUs, LotHero, LotsList } from "@/components";
import LotSearchBar from "@/components/lots/LotSearchBar";
import { Suspense } from "react";

export const metadata = {
  title: "Barcha Faol Lotlar - Universal Auksion",
  description:
    "Barcha kategoriyalardagi eng so'nggi auksion lotlari bilan tanishing. Ko'chmas mulk, avtotransport va boshqa ko'plab savdolarda qatnashing.",
};

export default async function AllLotsPage({ searchParams }) {
  const {
    page = 1,
    name = "",
    category = "",
    province = "",
    region = "",
  } = await searchParams;

  const fetchAllLots = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit: 12,
        name,
        category,
        province,
        region,
      });

      const res = await fetch(
        `https://auksion-backend-production.up.railway.app/api/lot?${query.toString()}`,
        {
          next: { revalidate: 60 },
        },
      );
      return res.json();
    } catch (error) {
      console.error("Error fetching all lots on server:", error);
      return { data: [], pagination: {} };
    }
  };

  const lotsResponse = await fetchAllLots();

  return (
    <main className="bg-gray-200 min-h-screen">
      <LotHero title="Barcha Lotlar" />
      <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 -mt-10 relative z-10">
        <Suspense fallback={<div className="h-24 bg-white/50 animate-pulse rounded-2xl" />}>
          <LotSearchBar />
        </Suspense>
      </div>
      <Suspense fallback={<div className="p-20 text-center text-gray-400 animate-pulse">Yuklanmoqda...</div>}>
        <LotsList data={lotsResponse.data} pagination={lotsResponse.pagination} />
      </Suspense>
      <AboutUs />
    </main>
  );
}
