import { News, NewsHero } from "@/components";

export const metadata = {
  title: "Yangiliklar va Tahlillar",
  description:
    "O'zbekiston auksion bozori, ko'chmas mulk va avtomobillar savdosidagi eng so'nggi yangiliklar. Foydali maslahatlar, qonunchilikdagi o'zgarishlar va tahliliy maqolalar.",
  keywords: [
    "auksion yangiliklari",
    "bozor tahlili",
    "ko'chmas mulk narxlari",
    "auksionda qatnashish tartibi",
    "Universal Auksion Invest blogi",
    "savdo yangiliklari O'zbekiston",
  ],

  openGraph: {
    title: "Yangiliklar va Tahlillar - Universal Auksion Invest",
    description:
      "Auksion olamidagi eng so'nggi voqealar va foydali maqolalar jamlanmasi. Biz bilan bozorni kuzatib boring.",
    url: "https://uainf-auksion.uz/news",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Universal Auksion Invest yangiliklari",
      },
    ],
    type: "article",
  },

  twitter: {
    card: "summary_large_image",
    title: "Yangiliklar va Maqolalar | Universal Auksion Invest",
    description:
      "Eng dolzarb auksion yangiliklari va mutaxassislar maslahati bir joyda.",
    images: ["/og.jpg"],
  },
};

export default async function NewsPage({ searchParams }) {
  const params = await searchParams;
  const page = params.page || 1;
  const limit = 12;

  let newsData = { news: [], totalPages: 0, currentPage: 1 };

  try {
    const res = await fetch(
      `http://localhost:8080/api/news?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 3600 }, // ISR: Revalidate every hour
      }
    );
    if (res.ok) {
      newsData = await res.json();
    }
  } catch (error) {
    console.error("Error fetching news on server:", error);
  }

  return (
    <main className="bg-gray-200">
      <NewsHero />
      <News
        initialData={newsData.news}
        totalPages={newsData.totalPages}
        currentPage={newsData.currentPage}
      />
    </main>
  );
}
