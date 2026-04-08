import { styles } from "@/styles/styles";
import Link from "next/link";

export default function ContactInfo() {
  return (
    <div className={`${styles.flexCol} items-start gap-4`}>
      <div>
        <h2 className={`${styles.h2} text-[#18436E]`}>Biz bilan aloqa</h2>
        <p className={`${styles.p}`}>
          Agar savollaringiz bo‘lsa yoki qo‘shimcha ma’lumot olishni istasangiz,
          aloqa shakli (forma) yoki ko‘rsatilgan kontaktlar orqali biz bilan
          bog‘lanishingiz mumkin. Mutaxassislarimiz sizga yordam berishga doim
          tayyor.
        </p>
      </div>
      <h2 className={`${styles.h2} text-[#18436E]`}>Bizning manzil</h2>
      <div className={`${styles.flexCol} items-start gap-4`}>
        <div className={`${styles.flexStart} items-center gap-2`}>
          <img src="/ico-1 (1).png" alt="ico" className="w-12" />
          <span className={`${styles.p} font-bold`}>Manzil:</span>
          <span className={`${styles.p}`}>
            Navoiy shahri, Islom Karimov ko'chasi 99-uy
          </span>
        </div>
        <div className={`${styles.flexStart} items-center gap-2`}>
          <img src="/ico-2.png" alt="ico" className="w-12" />
          <span className={`${styles.p} font-bold`}>Telefon:</span>
          <Link href="tel:+998908068580" className={`${styles.p}`}>
            +998 90 806 85 80
          </Link>
        </div>
        <div className={`${styles.flexStart} items-center gap-2`}>
          <img src="/ico-3 (1).png" alt="ico" className="w-12" />
          <span className={`${styles.p} font-bold`}>Email:</span>
          <Link href="mailto:sharipov_ss@mail.ru" className={`${styles.p}`}>
            sharipov_ss@mail.ru
          </Link>
        </div>
      </div>
    </div>
  );
}
