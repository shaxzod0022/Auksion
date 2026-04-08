import { styles } from "@/styles/styles";
import { Mail, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#18436E]">
      <ul
        className={`flex items-center sm:flex-row flex-col sm:gap-5 2xl:gap-10 xl:gap-8 lg:gap-6 md:gap-5 gap-2 max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 pt-4`}
      >
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:underline text-white transition`}
            href="/"
          >
            Bosh sahifa
          </Link>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:underline text-white transition`}
            href="/about"
          >
            Auksion haqida
          </Link>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:underline text-white transition`}
            href="/lots"
          >
            Lotlar
          </Link>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:underline text-white transition`}
            href="/news"
          >
            Yangiliklar
          </Link>
        </li>
        <li className={`group`}>
          <Link
            className={`${styles.p} hover:underline text-white transition`}
            href="/contact"
          >
            Bog'lanish
          </Link>
        </li>
      </ul>
      <div className="border-t border-white my-4"></div>
      <div className="max-w-[1900px] mx-auto 2xl:px-32 xl:px-28 lg:px-16 md:px-10 sm:px-8 px-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-10">
        <div className="flex flex-col gap-5">
          <div className={`${styles.flexCol} gap-3`}>
            <Link href="/">
              <Image
                src="/icon.png"
                alt="Universal Auksion Invest Logotip"
                width={100}
                height={100}
                className="md:w-24 md:h-24 w-16 h-16"
              />
            </Link>
            <h1 className={`${styles.h2} font-bold text-white`}>
              Elektron Onlayn Auksion Savdolari
            </h1>
          </div>
          {/* <div className={`${styles.flexStart} gap-3`}>
            <Link
              href="/contact"
              className={`${styles.flexCenter} border-3 hover:scale-105 border-white rounded-full p-2`}
            >
              <Send className="text-white" />
            </Link>
            <Link
              href="mailto: sharipov_ss@mail.ru"
              className={`${styles.flexCenter} border-3 hover:scale-105 border-white rounded-full p-2`}
            >
              <Mail className="text-white" />
            </Link>
          </div> */}
          <div>
            <h3 className={`${styles.h3} text-white`}>Manzil</h3>
            <p className={`${styles.p} text-white`}>
              Navoiy shahri, Islom Karimov ko'chasi 99-uy
            </p>
          </div>
          <div>
            <h3 className={`${styles.h3} text-white`}>Aloqa</h3>
            <Link href="tel:+998908068580" className={`${styles.p} text-white`}>
              +998 90 806 85 80
            </Link>
          </div>
        </div>
        <div>
          <h2 className={`${styles.h2} text-white mb-5`}>
            Ofitsialniy resurslar
          </h2>
          <Link
            target="_blank"
            href="https://www.davaktiv.uz/"
            className={`${styles.p} text-white`}
          >
            Агентство по управлению государственными активами
          </Link>
        </div>
        <div>
          <h1 className={`${styles.h2} text-white mb-5`}>Texnik ma'lumotlar</h1>
          <Link href="tel:+998908068580" className={`${styles.p} text-white`}>
            +998 90 806 85 80
          </Link>
        </div>
      </div>
      <div className="border-t border-white my-4"></div>
      <p className={`${styles.p} text-white text-center pb-4`}>
        © 2026 Universal Auksion Invest. Barcha huquqlar himoyalangan.
      </p>
    </footer>
  );
}
