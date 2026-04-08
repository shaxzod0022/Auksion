"use client";

import { styles } from "@/styles/styles";
import { Wifi, ChevronRight, Calendar } from "lucide-react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import newsService from "@/services/newsService";

const API_BASE_URL = "http://localhost:8080";


export default function News({ initialData = [] }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const latestNews = await newsService.getLatestNews();
        setData(latestNews);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    };
    if (initialData.length === 0) {
      fetchNews();
    }
  }, [initialData]);

  if (loading && data.length === 0) {
    return (
      <div className={`${styles.paddingCont} flex justify-center items-center h-[400px]`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18436E]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div
      className={`${styles.paddingCont} grid grid-cols-1 lg:grid-cols-3 gap-6`}
    >
      <div className="col-span-1 lg:col-span-2 relative group h-[400px] md:h-[500px]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full rounded-xl overflow-hidden shadow-2xl"
        >
          {data.map((item) => (
            <SwiperSlide key={item._id} className="group/slide">
              <div
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url('${API_BASE_URL}/upload/${item.image}')`,
                }}
                className="w-full h-full bg-cover bg-center flex flex-col justify-end p-6 md:p-10"
              >
                <div className="max-w-2xl transform translate-y-4 transition-all duration-700 opacity-0 in-[.swiper-slide-active]:translate-y-0 in-[.swiper-slide-active]:opacity-100">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block tracking-wider uppercase">
                    Muhim Yangiliklar
                  </span>
                  <h2
                    className={`${styles.h2} text-white mb-4 line-clamp-2 leading-tight`}
                  >
                    {item.name}
                  </h2>
                  <p
                    className={`${styles.p} text-gray-200 font-normal line-clamp-3 mb-6 opacity-90`}
                  >
                    {item.shortDescription}
                  </p>
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center gap-2 bg-white text-[#18436E] px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg group/btn"
                  >
                    Batafsil
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Custom Navigation */}
          <button className="swiper-button-prev-custom absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <button className="swiper-button-next-custom absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ChevronRight className="w-6 h-6" />
          </button>
        </Swiper>
      </div>

      <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden max-h-[500px]">
        <div
          className={`${styles.flexBetween} gap-2 border-b border-gray-100 p-5 bg-gray-50/50`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Wifi className="w-5 h-5 text-red-500 rotate-45" />
            </div>
            <h2 className={`${styles.h4} font-bold text-gray-800`}>
              Yangiliklar
            </h2>
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-[#18436E] hover:underline"
          >
            Barchasi
          </Link>
        </div>

        <div className="overflow-y-auto custom-scrollbar">
          {data.map((item) => (
            <Link
              key={item._id}
              href={`/news/${item.slug}`}
              className="flex gap-4 p-4 hover:bg-blue-50/30 transition border-b border-gray-50 last:border-0 group"
            >
              <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden relative shadow-sm">
                <img
                  src={`${API_BASE_URL}/upload/${item.image}`}
                  alt={item.name}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <h3 className="text-[14px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#18436E] transition">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-2">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
