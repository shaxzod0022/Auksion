import { AboutUs, Categories, LotHero } from "@/components";

export const metadata = {
  // ... (keeping existing metadata for SEO)
  title: "Faol Lotlar va Onlayn Auksionlar",
  description:
    "Sotuvdagi barcha joriy lotlar bilan tanishing: ko'chmas mulk, avtotransport vositalari va maxsus texnikalar. Onlayn auksionlarda qatnashing, o'z narxingizni taklif qiling va qulay shartlarda sotib oling.",
  keywords: [
    "lotlar ro'yxati",
    "auksion savdolari",
    "ko'chmas mulk auksioni",
    "avtomobillar savdosi",
    "arzon mulklar",
    "onlayn auksionda qatnashish",
    "savdoga qo'yilgan mulklar",
    "Universal Auksion lotlari",
  ],
};

export default async function Page() {
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://considerate-integrity-production.up.railway.app/api/category",
        {
          next: { revalidate: 60 },
        },
      );
      return res.json();
    } catch (error) {
      console.error("Error fetching categories on server:", error);
      return [];
    }
  };

  const categoriesData = await fetchCategories();

  return (
    <main className="bg-gray-200 min-h-screen">
      <LotHero />
      <Categories initialData={categoriesData} />
      <AboutUs />
    </main>
  );
}
