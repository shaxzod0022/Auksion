import { Lots, NewsHome, Payment, Statistica } from "@/components";
import LotSearchBar from "@/components/lots/LotSearchBar";
import { Suspense } from "react";

export default async function Home() {
  const fetchLatestLots = async () => {
    try {
      const res = await fetch(
        "https://auksion-backend-production.up.railway.app/api/lot/latest",
        {
          next: { revalidate: 60 },
        },
      );
      return res.json();
    } catch (error) {
      console.error("Error fetching latest lots:", error);
      return [];
    }
  };

  const fetchLatestNews = async () => {
    try {
      const res = await fetch(
        "https://auksion-backend-production.up.railway.app/api/news/latest",
        {
          next: { revalidate: 60 },
        },
      );
      return res.json();
    } catch (error) {
      console.error("Error fetching latest news:", error);
      return [];
    }
  };

  const [lots, news] = await Promise.all([
    fetchLatestLots(),
    fetchLatestNews(),
  ]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <NewsHome initialData={news} />

      <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 py-8">
        <Suspense fallback={<div className="h-20 bg-white/50 animate-pulse rounded-2xl" />}>
          <LotSearchBar />
        </Suspense>
      </div>

      <Lots initialData={lots} />
      <Statistica />
      <Payment />
    </main>
  );
}
