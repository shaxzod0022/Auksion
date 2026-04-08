import { AboutUs, LotHero, LotsList } from "@/components";
import LotSearchBar from "@/components/lots/LotSearchBar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function CategoryLotsPage({ params, searchParams }) {
  const { slug } = await params;
  const { 
    page = 1, 
    name = "", 
    province = "", 
    region = "" 
  } = await searchParams;

  const fetchCategory = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/category/slug/${slug}`, {
        next: { revalidate: 60 },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching category details:", error);
      return null;
    }
  };

  const fetchLots = async () => {
    try {
      const query = new URLSearchParams({
        category: slug,
        page,
        name,
        province,
        region,
        limit: 12
      });

      const res = await fetch(`http://localhost:8080/api/lot?${query.toString()}`, {
        next: { revalidate: 60 },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching lots for category:", error);
      return { data: [], pagination: {} };
    }
  };

  const [category, lotsResponse] = await Promise.all([
    fetchCategory(),
    fetchLots(),
  ]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <LotHero title={category?.name} image={category?.image} />
      
      <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 -mt-10 relative z-10">
        <LotSearchBar />
      </div>

      <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 mt-10">
        <Link 
          href="/lots" 
          className="inline-flex items-center gap-2 text-[#18436E] font-bold hover:underline mb-5 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Barcha kategoriyalar
        </Link>
      </div>

      <LotsList data={lotsResponse.data} pagination={lotsResponse.pagination} />
      <AboutUs />
    </main>
  );
}
