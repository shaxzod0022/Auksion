"use client";
import { styles } from "@/styles/styles";
import { useRouter } from "next/navigation";

const API_BASE_URL = "https://considerate-integrity-production.up.railway.app";

export default function Categories({ initialData = [] }) {
  const router = useRouter();
  if (!initialData || initialData.length === 0) return null;

  return (
    <div
      className={`${styles.paddingCont} grid 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5`}
    >
      {initialData.map((category) => (
        <div
          onClick={() => router.push(`/lots/category/${category.slug}`)}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${API_BASE_URL}/upload/${category.image})`,
          }}
          key={category._id}
          className="text-white bg-center bg-no-repeat bg-cover text-lg font-medium flex flex-col items-center justify-center h-40 rounded-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
        >
          <h3
            className={`${styles.h3} text-white group-hover:scale-110 transition-transform`}
          >
            {category.name}
          </h3>
          <p className={`${styles.p} text-white opacity-80`}>
            ({category.count || 0})
          </p>
        </div>
      ))}
    </div>
  );
}
