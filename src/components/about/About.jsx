"use client";
import { styles } from "@/styles/styles";
import { useState } from "react";

const buttons = [
  {
    id: 1,
    title: "Mahfiylik siyosati",
  },
  {
    id: 2,
    title: "Ko'p beriladigan savollar",
  },
  {
    id: 3,
    title: "Savdoda qatnashish ofertalari",
  },
  {
    id: 4,
    title: "Shaxsiy kabinetdan foydalanish qoidalari",
  },
  {
    id: 5,
    title:
      "Auksionda ishtirok etish va mulkingizni auksionda qo'yish bo'yicha ko'rsatmalar",
  },
  {
    id: 6,
    title: "Raxbariyat",
  },
  {
    id: 7,
    title: "Maqola",
  },
  {
    id: 8,
    title: "Yordam",
  },
  {
    id: 9,
    title: "Auksion haqida",
  },
];

export default function About() {
  const [active, setActive] = useState(null);
  return (
    <div
      className={`${styles.paddingCont} grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-5`}
    >
      <div className="col-span-1 lg:col-span-2 2xl:col-span-2"></div>
      <div
        className={`${styles.flexCol} p-4 bg-white rounded-md col-span-1 lg:col-span-2 2xl:col-span-1`}
      >
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => setActive(active === button.id ? null : button.id)}
            className={`${styles.p} ${buttons.length !== button.id ? "border-b" : "border-b"} border-gray-300 cursor-pointer hover:text-[#18436E] transition flex items-center gap-2 p-3`}
          >
            <img
              src="/arrow.png"
              alt="Arrow"
              className={`w-10 transition-all duration-300 ${active === button.id ? "rotate-90" : ""}`}
            />
            <span className="text-left">{button.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
