import { About, Hero } from "@/components";

export const metadata = {
  title: "Biz haqimizda",
  description:
    "Universal Auksion Invest Bizning maqsadimiz — mulk savdosida shaffoflik va xavfsiz yechimlarni taqdim etish.",
  keywords: [
    "auksion haqida",
    "bizning tajriba",
    "savdo tashkilotchisi",
    "auksion investitsiya",
    "xavfsiz auksion",
    "Universal Auksion Invest jamoasi",
  ],

  openGraph: {
    title: "Biz haqimizda - Universal Auksion Invest",
    description:
      "Bizning platformamiz qanday ishlashi va qadriyatlarimiz bilan tanishing.",
    url: "https://uainf-auksion.uz/about",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Universal Auksion Invest haqida",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Biz haqimizda | Universal Auksion Invest",
    description:
      "Bizning tajribamiz va auksion o'tkazish tartiblarimiz haqida batafsil ma'lumot.",
    images: ["/og.jpg"],
  },
};

export default function AboutPage() {
  return (
    <main className="bg-gray-200">
      <Hero />
      <About />
    </main>
  );
}
