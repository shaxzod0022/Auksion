import { Lots, NewsHome, Payment, Statistica } from "@/components";
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
      <Lots initialData={lots} />
      <Statistica />
      <Payment />
    </main>
  );
}
