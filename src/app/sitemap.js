export default async function sitemap() {
  const baseUrl = "https://www.uainf-auksion.uz";
  const apiBaseUrl = "http://localhost:8080/api";

  // Static routes
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "always", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/lots/lots`, lastModified: new Date(), changeFrequency: "always", priority: 0.9 },
    { url: `${baseUrl}/lots/completed`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/lots/unsold`, lastModified: new Date(), changeFrequency: "daily", priority: 0.6 },
    { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  try {
    // Fetch Lots
    const lotsRes = await fetch(`${apiBaseUrl}/lot?all=true`);
    const lots = await lotsRes.json();
    const lotRoutes = lots.map((lot) => ({
      url: `${baseUrl}/lots/${lot.slug}`,
      lastModified: new Date(lot.updatedAt),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Fetch News
    const newsRes = await fetch(`${apiBaseUrl}/news`);
    const newsList = await newsRes.json();
    const newsRoutes = newsList.map((news) => ({
      url: `${baseUrl}/news/${news.slug}`,
      lastModified: new Date(news.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...lotRoutes, ...newsRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return staticRoutes;
  }
}

