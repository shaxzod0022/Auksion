import { styles } from "@/styles/styles";

const API_BASE_URL = "https://considerate-integrity-production.up.railway.app";

export default function Hero({ title = "Lotlar", image = "/lot_hero.jpg" }) {
  const imageUrl = image.startsWith("http")
    ? image
    : image.startsWith("/")
      ? image
      : `${API_BASE_URL}/upload/${image}`;

  return (
    <div className="relative w-full overflow-hidden h-[20vh] md:h-[35vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-700 ease-in-out">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-[#0D0D0C80]" />
      </div>

      <h2 className={`${styles.h1} text-white! z-10 text-center capitalize`}>
        {title}
      </h2>
    </div>
  );
}
