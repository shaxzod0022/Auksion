"use client";

import { styles } from "@/styles/styles";
import { Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const API_BASE_URL = "http://localhost:8080";

export default function News({ initialData = [], totalPages = 1, currentPage = 1 }) {
  const page = parseInt(currentPage);

  return (
    <div className={`${styles.paddingCont} py-12`}>
      {initialData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h2 className={`${styles.h2} text-gray-400 font-medium`}>
            Yangiliklar topilmadi
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialData.map((item) => (
              <Link
                key={item._id}
                href={`/news/${item.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={`${API_BASE_URL}/upload/${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-[#18436E] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                      Auksion
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.views || 0}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight transition-colors group-hover:text-[#18436E]">
                    {item.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed flex-1">
                    {item.shortDescription}
                  </p>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[#18436E] font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Batafsil
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center gap-2">
              {/* Prev Button */}
              <Link
                href={`/news?page=${Math.max(1, page - 1)}`}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    : "bg-white text-gray-700 hover:bg-[#18436E] hover:text-white shadow-sm border border-gray-100"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = page === pageNum;
                return (
                  <Link
                    key={pageNum}
                    href={`/news?page=${pageNum}`}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? "bg-[#18436E] text-white shadow-lg shadow-blue-900/20"
                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-100 shadow-sm"
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              {/* Next Button */}
              <Link
                href={`/news?page=${Math.min(totalPages, page + 1)}`}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  page === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
                    : "bg-white text-gray-700 hover:bg-[#18436E] hover:text-white shadow-sm border border-gray-100"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
