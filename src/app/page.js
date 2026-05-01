import {
  Categories,
  HomeSearchBar,
  Lots,
  NewsHome,
  Payment,
  Statistica,
} from "@/components";

export default async function Home() {
  const fetchLatestLots = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/lot/latest", {
        next: { revalidate: 60 },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching latest lots:", error);
      return [];
    }
  };

  const fetchLatestNews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/news/latest", {
        next: { revalidate: 60 },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching latest news:", error);
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/category", {
        next: { revalidate: 60 },
      });
      return res.json();
    } catch (error) {
      console.error("Error fetching categories on server:", error);
      return [];
    }
  };

  const [lots, news, categories] = await Promise.all([
    fetchLatestLots(),
    fetchLatestNews(),
    fetchCategories(),
  ]);

  return (
    <main className="bg-gray-200 min-h-screen">
      <NewsHome initialData={news} />
      <HomeSearchBar />
      <Categories initialData={categories} />
      <Lots initialData={lots} />
      <Statistica />
      <Payment />
    </main>
  );
}
