import { ContactHero, Map, ContactMain } from "@/components";

export const metadata = {
  title: "Bog‘lanish",
  description:
    "Savollaringiz bormi? Universal Auksion Invest mutaxassislari bilan bog‘laning. Telefon, elektron pochta yoki onlayn shakl orqali yordam berishga tayyormiz.",
  keywords: [
    "auksion bilan bog‘lanish",
    "Universal Auksion Invest kontakt",
    "auksion qo‘llab-quvvatlash xizmati",
    "savollar va javoblar",
    "auksionga ariza topshirish",
  ],

  openGraph: {
    title: "Bog‘lanish - Universal Auksion Invest",
    description:
      "Biz bilan bog‘laning va barcha savollaringizga javob oling. Mutaxassislarimiz sizga yordam berish uchun hamisha tayyor.",
    url: "https://uainf-auksion.uz/contact",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Universal Auksion Invest bilan bog‘lanish",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bog‘lanish | Universal Auksion Invest",
    description:
      "Savollaringiz bo‘lsa, bizga murojaat qiling. Tezkor va ishonchli yordam xizmati.",
    images: ["/og.jpg"],
  },
};

export default function ContactPage() {
  return (
    <main className="bg-gray-200">
      <ContactHero />
      <ContactMain />
      <Map />
    </main>
  );
}
