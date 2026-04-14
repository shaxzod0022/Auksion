"use client";
import { styles } from "@/styles/styles";
import { ChevronDown, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SideBar from "./SideBar";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(false);
  const { isLoggedIn, isAdmin, isInitialized } = useSelector(
    (state) => state.auth,
  );
  return (
    <nav className={`w-full bg-white relative`}>
      <SideBar open={open} setOpen={setOpen} />
      <div className={`bg-[#18436E] w-full sm:block hidden`}>
        <div
          className={`max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 py-2 sm:py-3 ${styles.flexEnd} sm:gap-5 gap-2`}
        >
          {isInitialized && (
            <>
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className={`text-white ${styles.p} ${styles.flexStart} gap-1 hover:text-gray-300 transition`}
                >
                  <img
                    className="md:w-10 w-6"
                    src="/ico-1.png"
                    alt="Ro'yxatan o'tish"
                  />
                  <span>Ro'yxatdan o'tish</span>
                </Link>
              )}
              <Link
                href={isAdmin ? "/admin" : isLoggedIn ? "/profile" : "/login"}
                className={`text-white ${styles.p} ${styles.flexStart} gap-1 hover:text-gray-300 transition`}
              >
                <img
                  className="md:w-10 w-6"
                  src="/ico-1.png"
                  alt="Shaxsiy kabinet"
                />
                <span>
                  {isAdmin
                    ? "Admin Panel"
                    : isLoggedIn
                      ? "Profil"
                      : "Shaxsiy kabinet"}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className={`cursor-pointer w-12 sm:hidden block p-3`}
      >
        <Menu className="text-black w-full" />
      </button>

      <div className="border-t border-[#18436E]"></div>
      <div
        className={`${styles.flexBetween} sm:gap-5 gap-2 max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 py-2 sm:py-3`}
      >
        <div className={`${styles.flexStart} gap-3`}>
          <Link href="/">
            <img
              src="/icon.png"
              alt="Universal Auksion Invest Logotip"
              className="md:w-24 md:h-24 w-16 h-16"
            />
          </Link>
          <h1
            className={`${styles.h2} lg:block hidden font-bold text-[#18436E]`}
          >
            Elektron Onlayn Auksion Savdolari
          </h1>
        </div>
        <Link
          href="/about"
          className={`${styles.flexCenter} gap-2 hover:text-[#18436E] transition`}
        >
          <div className={`${styles.flexCenter} bg-[#18436E] rounded-full p-2`}>
            <img
              className="md:w-8 w-4"
              src="/ico-3.png"
              alt="Ko'p beriladigan savollar"
            />
          </div>
          <span className={`${styles.p}`}>Ko'p beriladigan savollar</span>
        </Link>
      </div>
      <div className="border-t border-[#18436E]"></div>
      <ul
        className={`${styles.flexStart} sm:flex hidden sm:gap-5 2xl:gap-10 xl:gap-8 lg:gap-6 md:gap-5 gap-2 max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 pt-4`}
      >
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:text-[#18436E] transition`}
            href="/"
          >
            Bosh sahifa
          </Link>
          <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 origin-left mt-2"></div>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:text-[#18436E] transition`}
            href="/about"
          >
            Auksion haqida
          </Link>
          <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 origin-left mt-2"></div>
        </li>
        <li
          className="group relative"
          onMouseEnter={() => setSubMenu(true)}
          onMouseLeave={() => setSubMenu(false)}
        >
          <Link
            className={`${styles.p} hover:text-[#18436E] transition-all duration-300 flex items-center gap-1.5`}
            href="/lots"
          >
            Lotlar
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                subMenu ? "rotate-180 text-[#18436E]" : "text-gray-400"
              }`}
            />
          </Link>

          <div
            className={`absolute top-full left-0 pt-3 z-50 transition-all duration-300 ${
              subMenu
                ? "opacity-100 transform translate-y-0 pointer-events-auto"
                : "opacity-0 transform translate-y-4 pointer-events-none"
            }`}
          >
            <div className="min-w-[200px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.2)] rounded-sm border border-gray-100 overflow-hidden py-2 backdrop-blur-xl bg-white/95">
              <Link
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-gray-700 hover:text-[#18436E] transition-all duration-200"
                href="/lots/lots"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[15px]">
                    Barcha lotlar
                  </span>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-gray-700 hover:text-[#18436E] transition-all duration-200"
                href="/lots/completed"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[15px]">
                    Yakunlangan lotlar
                  </span>
                </div>
              </Link>

              <Link
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 text-gray-700 hover:text-[#18436E] transition-all duration-200"
                href="/lots/unsold"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-[15px]">
                    Sotilmagan lotlar
                  </span>
                </div>
              </Link>
            </div>
          </div>
          <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left mt-2"></div>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:text-[#18436E] transition`}
            href="/news"
          >
            Yangiliklar
          </Link>
          <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 origin-left mt-2"></div>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:text-[#18436E] transition`}
            href="/contact"
          >
            Bog'lanish
          </Link>
          <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 origin-left mt-2"></div>
        </li>
        {isLoggedIn && !isAdmin && (
          <li className={`group`}>
            <Link
              className={`${styles.p} hover:text-[#18436E] transition`}
              href="/protocols"
            >
              Bayonnomalarim
            </Link>
            <div className="w-full h-[4px] bg-[#18436E] transform scale-x-0 group-hover:scale-x-100 origin-left mt-2"></div>
          </li>
        )}
      </ul>
      <div className={`bg-[#18436E] sm:hidden block w-full`}>
        <div
          className={`max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 py-2 sm:py-3 ${styles.flexCenter} sm:gap-5 gap-2`}
        >
          {isInitialized && (
            <>
              {!isLoggedIn && (
                <Link
                  href="/register"
                  className={`text-white ${styles.p} ${styles.flexStart} gap-1 hover:text-gray-300 transition`}
                >
                  <img
                    className="md:w-10 w-6"
                    src="/ico-1.png"
                    alt="Ro'yxatan o'tish"
                  />
                  <span>Ro'yxatdan o'tish</span>
                </Link>
              )}
              <Link
                href={isAdmin ? "/admin" : isLoggedIn ? "/profile" : "/login"}
                className={`text-white ${styles.p} ${styles.flexStart} gap-1 hover:text-gray-300 transition`}
              >
                <img
                  className="md:w-10 w-6"
                  src="/ico-1.png"
                  alt="Shaxsiy kabinet"
                />
                <span>
                  {isAdmin
                    ? "Admin Panel"
                    : isLoggedIn
                      ? "Profil"
                      : "Shaxsiy kabinet"}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
