import newsService from "@/services/newsService";
import NewsContent from "@/components/news/NewsContent";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const news = await newsService.getNewsBySlug(slug);
    if (!news || !news._id) {
      return { title: "Yangilik topilmadi" };
    }

    return {
      title: `${news.name} | Universal Auksion Invest`,
      description: news.shortDescription,
      openGraph: {
        title: news.name,
        description: news.shortDescription,
        images: [
          `https://auksion-backend-production.up.railway.app/upload/${news.image}`,
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: news.name,
        description: news.shortDescription,
        images: [
          `https://auksion-backend-production.up.railway.app/upload/${news.image}`,
        ],
      },
    };
  } catch (error) {
    return { title: "Yangiliklar | Universal Auksion Invest" };
  }
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  let news = null;

  try {
    news = await newsService.getNewsBySlug(slug);
  } catch (error) {
    console.error("Error fetching news detail:", error);
  }

  if (!news || !news._id) {
    notFound();
  }

  return (
    <main className="bg-white">
      <NewsContent data={news} />
    </main>
  );
}
