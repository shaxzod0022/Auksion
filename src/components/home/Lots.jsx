"use client";

import { useEffect, useState } from "react";
import { styles } from "@/styles/styles";
import Link from "next/link";

const API_BASE_URL = "https://considerate-integrity-production.up.railway.app";

const Timer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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

export default function Lots({ initialData = [] }) {
  if (initialData.length === 0) return null;

  return (
    <div className={`${styles.paddingCont} ${styles.flexCenter} flex-col`}>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10`}
      >
        {initialData.map((item) => (
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
                <p className={`${styles.span} font-extrabold text-[#18436E]`}>
                  {item.startPrice.toLocaleString()} so'm
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/lots/lots"
        className={`${styles.flexCenter} bg-[#18436E] text-white px-10 py-2.5 rounded-sm font-bold hover:bg-[#18436E]/80 transition shadow-lg`}
      >
        Barcha lotlar
      </Link>
    </div>
  );
}
