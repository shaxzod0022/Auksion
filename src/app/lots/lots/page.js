import { AboutUs, LotHero, LotsList } from "@/components";

export const metadata = {
  title: "Barcha Faol Lotlar - Universal Auksion",
  description: "Barcha kategoriyalardagi eng so'nggi auksion lotlari bilan tanishing. Ko'chmas mulk, avtotransport va boshqa ko'plab savdolarda qatnashing.",
};

export default async function AllLotsPage({ searchParams }) {
  const { page = 1 } = await searchParams;

  const fetchAllLots = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/lot?page=${page}&limit=12`, {
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
      <LotsList data={lotsResponse.data} pagination={lotsResponse.pagination} />
      <AboutUs />
    </main>
  );
}
