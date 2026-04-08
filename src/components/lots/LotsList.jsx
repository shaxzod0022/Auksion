"use client";

import { useState, useEffect } from "react";
import { styles } from "@/styles/styles";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_BASE_URL = "https://auksion-backend-production.up.railway.app";

const Timer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isMounted) return <div className="h-6" />; // Placeholder to avoid layout shift

  if (!timeLeft) {
    return (
      <p className={`${styles.p} text-red-500 font-semibold`}>
        Savdo yakunlangan
      </p>
    );
  }

  return (
    <div className="flex gap-3 text-[#18436E] font-bold">
      <span
        className={`${styles.h3} text-[#18436E] ${styles.flexCol} items-center`}
      >
        {timeLeft.days}
        <span className="text-sm">kun</span>
      </span>
      <span
        className={`${styles.h3} text-[#18436E] ${styles.flexCol} items-center`}
      >
        {timeLeft.hours}
        <span className="text-sm">soat</span>
      </span>
      <span
        className={`${styles.h3} text-[#18436E] ${styles.flexCol} items-center`}
      >
        {timeLeft.minutes}
        <span className="text-sm">daqiqa</span>
      </span>
      <span
        className={`${styles.h3} text-[#18436E] ${styles.flexCol} items-center`}
      >
        {timeLeft.seconds}
        <span className="text-sm">soniya</span>
      </span>
    </div>
  );
};

export default function LotsList({ data = [], pagination = {} }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    router.push(`/lots?${params.toString()}`, { scroll: false });
  };

  if (!data || data.length === 0) {
    return (
      <div className={`${styles.paddingCont} flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 mt-10`}>
        <div className="text-gray-400 mb-4 text-6xl">📦</div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">Hozircha lotlar mavjud emas</h3>
        <p className="text-gray-400 text-center max-w-md">
          Ushbu kategoriya bo'yicha hozirda faol lotlar topilmadi. Iltimos, boshqa kategoriyalarni ko'zdan kechiring.
        </p>
      </div>
    );
  }

  const { totalPages, currentPage } = pagination;

  return (
    <div className={`${styles.paddingCont} pb-20`}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10 mb-10">
        {data.map((item) => (
          <Link
            href={`/lots/${item.slug}`}
            key={item._id}
            className={`bg-white p-3 rounded-sm shadow-sm overflow-hidden flex justify-between flex-wrap items-center hover:shadow-md transition-shadow`}
          >
            <div className="relative sm:w-1/2 w-full">
              <img
                src={`${API_BASE_URL}/upload/${item.image}`}
                alt={item.category?.name}
                className="w-full h-48 object-cover rounded-sm"
              />
              <span
                className={`${styles.p} absolute bottom-2 left-2 bg-[#18436E] text-white px-2 py-0.5 rounded shadow-lg`}
              >
                {item.category?.name}
              </span>
            </div>
            <div className="sm:w-1/2 w-full p-2 flex flex-col justify-between h-48">
              <div className="flex flex-col items-center gap-1">
                <h3
                  className={`${styles.h4} font-bold text-center text-gray-800 leading-tight`}
                >
                  Auksion o'tkazish vaqti
                </h3>
                <Timer targetDate={item.startDate} />
              </div>
              <div className="flex flex-col items-end border-t border-gray-100 pt-3">
                <p
                  className={`${styles.span} text-gray-500 uppercase tracking-wider`}
                >
                  Boshlang'ich narx
                </p>
                <p className={`${styles.h4} font-extrabold text-[#18436E]`}>
                  {item.startPrice.toLocaleString()} so'm
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const isActive = currentPage === pageNum;

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[#18436E] text-white shadow-lg shadow-blue-900/20"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-[#18436E] hover:text-[#18436E]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
