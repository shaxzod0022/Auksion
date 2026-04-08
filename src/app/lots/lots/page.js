import { AboutUs, LotHero, LotsList } from "@/components";
import LotSearchBar from "@/components/lots/LotSearchBar";

export const metadata = {
  title: "Barcha Faol Lotlar - Universal Auksion",
  description: "Barcha kategoriyalardagi eng so'nggi auksion lotlari bilan tanishing. Ko'chmas mulk, avtotransport va boshqa ko'plab savdolarda qatnashing.",
};

export default async function AllLotsPage({ searchParams }) {
  const { 
    page = 1, 
    name = "", 
    category = "", 
    province = "", 
    region = "" 
  } = await searchParams;

  const fetchAllLots = async () => {
    try {
      const query = new URLSearchParams({
        page,
        limit: 12,
        name,
        category,
        province,
        region
      });
      
      const res = await fetch(`http://localhost:8080/api/lot?${query.toString()}`, {
        next: { revalidate: 60 },
      });
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
        <LotSearchBar />
      </div>
      <LotsList data={lotsResponse.data} pagination={lotsResponse.pagination} />
      <AboutUs />
    </main>
  );
}
