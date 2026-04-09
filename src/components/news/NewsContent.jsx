"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Eye, Clock, ChevronRight } from "lucide-react";
import { styles } from "@/styles/styles";

export default function NewsContent({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateString) => {
    if (!mounted) return "";
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  return (
    <div className="bg-white min-h-screen pb-20">
      <article className={`${styles.paddingCont}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#18436E] leading-tight mb-6">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-y border-gray-100 py-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <span suppressHydrationWarning>
                    {formatDate(data.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={18} className="text-blue-600" />
                  <span>{data.views || 0} marta ko'rildi</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl mb-10 group">
              <img
                src={`https://auksion-backend-production.up.railway.app/upload/${data.image}`}
                alt={data.name}
                className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Content Body */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p className="text-xl font-medium text-gray-900 border-l-4 border-blue-600 pl-6 italic">
                {data.shortDescription}
              </p>

              <div
                className="news-content-rich"
                dangerouslySetInnerHTML={{ __html: data.longDescription }}
              />
            </div>

            {/* Sharing Section */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                href="/news"
                className="flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                Barcha yangiliklarga qaytish
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Sidebar - Placeholder for related news or ads */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#18436E] rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">
                Auksionda qatnashmoqchimisiz?
              </h3>
              <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                Hoziroq ro'yxatdan o'ting va eng foydali lotlarni qo'ldan boy
                bermang.
              </p>
              <Link
                href="/register"
                className="block w-full text-center bg-white text-[#18436E] font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Ro'yxatdan o'tish
              </Link>
            </div>
          </div>
        </div>
      </article>

      <style jsx global>{`
        .news-content-rich p {
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .news-content-rich h2 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #18436e;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
        }
        .news-content-rich h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #18436e;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .news-content-rich ul,
        .news-content-rich ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .news-content-rich li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
