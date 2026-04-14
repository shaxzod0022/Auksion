"use client";

import { useState, useEffect } from "react";
import { styles } from "@/styles/styles";
import { X } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function SideBar({ open, setOpen }) {
  const { isLoggedIn, isAdmin, isInitialized } = useSelector((state) => state.auth);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 sm:hidden ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out sm:hidden shadow-2xl ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <span className={`${styles.h3} text-[#18436E]`}>Menyu</span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <ul className={`${styles.flexCol} gap-4 p-6`}>
          <li className="block" onClick={() => setOpen(false)}>
            <Link
              className={`${styles.p} block py-2 hover:text-[#18436E] transition border-b border-gray-50`}
              href="/"
            >
              Bosh sahifa
            </Link>
          </li>
          <li className="block" onClick={() => setOpen(false)}>
            <Link
              className={`${styles.p} block py-2 hover:text-[#18436E] transition border-b border-gray-50`}
              href="/about"
            >
              Auksion haqida
            </Link>
          </li>
          <li className="block">
            <div className={`${styles.p} block py-2 text-[#18436E] font-bold border-b border-gray-100 bg-gray-50/50 px-2`}>
              Lotlar
            </div>
            <ul className="pl-4 mt-2 space-y-2">
              <li onClick={() => setOpen(false)}>
                <Link className={`${styles.p} block py-2 hover:text-[#18436E] transition text-sm`} href="/lots/lots">
                  • Faol lotlar
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link className={`${styles.p} block py-2 hover:text-[#18436E] transition text-sm`} href="/lots/completed">
                  • Yakunlangan lotlar
                </Link>
              </li>
              <li onClick={() => setOpen(false)}>
                <Link className={`${styles.p} block py-2 hover:text-[#18436E] transition text-sm`} href="/lots/unsold">
                  • Sotilmagan lotlar
                </Link>
              </li>
            </ul>
          </li>
          <li className="block" onClick={() => setOpen(false)}>
            <Link
              className={`${styles.p} block py-2 hover:text-[#18436E] transition border-b border-gray-50`}
              href="/news"
            >
              Yangiliklar
            </Link>
          </li>
          <li className="block" onClick={() => setOpen(false)}>
            <Link
              className={`${styles.p} block py-2 hover:text-[#18436E] transition border-b border-gray-50`}
              href="/contact"
            >
              Bog'lanish
            </Link>
          </li>
        </ul>

        {/* Action Buttons for Mobile */}
        <div className="p-6 mt-auto flex flex-col gap-3">
          {isInitialized && (
            <>
              {!isLoggedIn && (
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full text-center py-3 bg-[#18436E] text-white rounded-lg font-medium hover:bg-[#123354] transition"
                >
                  Ro'yxatdan o'tish
                </Link>
              )}
              <Link
                href={isAdmin ? "/admin" : isLoggedIn ? "/profile" : "/login"}
                onClick={() => setOpen(false)}
                className="w-full text-center py-3 border border-[#18436E] text-[#18436E] rounded-lg font-medium hover:bg-gray-50 transition"
              >
                {isAdmin ? "Admin Panel" : isLoggedIn ? "Profil" : "Shaxsiy kabinet"}
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
