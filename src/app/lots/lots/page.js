import { AboutUs, LotHero, LotsList } from "@/components";
import LotSearchBar from "@/components/lots/LotSearchBar";
import { styles } from "@/styles/styles";
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
    lotType = "",
    province = "",
    region = "",
  } = await searchParams;

  const fetchAllLots = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit: 12,
        name,
        lotType,
        province,
        region,
      });

      const res = await fetch(
        `https://considerate-integrity-production.up.railway.app/api/lot?${query.toString()}`,
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
      <div className={`${styles.paddingCont}`}>
        <Suspense
          fallback={<div className="bg-white/50 animate-pulse rounded-sm" />}
        >
          <LotSearchBar />
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="p-20 text-center text-gray-400 animate-pulse">
            Yuklanmoqda...
          </div>
        }
      >
        <LotsList
          data={lotsResponse.data}
          pagination={lotsResponse.pagination}
        />
      </Suspense>
      <AboutUs />
    </main>
  );
}
