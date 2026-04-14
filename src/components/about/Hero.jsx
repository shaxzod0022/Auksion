import { styles } from "@/styles/styles";

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden h-[20vh] md:h-[35vh] flex items-center justify-center">
      {/* Slider */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <img
          src="/auksion_hero.jpg"
          alt="About Header"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-[#0D0D0C80]" />
      </div>

      <h2 className={`${styles.h1} text-white! z-10`}>Auksion haqida</h2>
    </div>
  );
}
