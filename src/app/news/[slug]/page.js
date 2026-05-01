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

    const imageUrl = news.image ? `http://localhost:8080/upload/${news.image}` : "/og.jpg";

    return {
      title: `${news.name} | Yangiliklar | Universal Auksion Invest`,
      description: news.shortDescription,
      openGraph: {
        title: news.name,
        description: news.shortDescription,
        images: [imageUrl],
        type: "article",
        publishedTime: news.createdAt,
      },
      twitter: {
        card: "summary_large_image",
        title: news.name,
        description: news.shortDescription,
        images: [imageUrl],
      },
      alternates: {
        canonical: `/news/${slug}`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: news.name,
    image: [news.image ? `http://localhost:8080/upload/${news.image}` : ""],
    datePublished: news.createdAt,
    dateModified: news.updatedAt,
    description: news.shortDescription,
    author: {
      "@type": "Organization",
      name: "Universal Auksion Invest",
      url: "https://www.uainf-auksion.uz",
    },
  };

  return (
    <main className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsContent data={news} />
    </main>
  );
}

