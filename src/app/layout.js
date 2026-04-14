import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Universal Auksion Invest | Barcha onlayn lotlar va savdolar",
    template: "%s | Universal Auksion Invest",
  },
  description:
    "Universal Auksion Invest - ko'chmas mulk, transport, texnika va boshqa ko'plab lotlar bo'yicha shaffof onlayn auksion savdolari platformasi.",
  keywords: [
    "auksion",
    "onlayn savdo",
    "lotlar",
    "elektron auksion",
    "savdolashish",
    "auksion uz",
    "ko'chmas mulk auksioni",
    "avtomobillar savdosi",
  ],

  metadataBase: new URL("https://uainf-auksion.uz"),

  openGraph: {
    title: "Universal Auksion Invest - Onlayn Savdolar va Lotlar",
    description:
      "Hozirgi faol lotlar bilan tanishing va o'z narxingizni taklif qiling. Biz bilan hammasi shaffof!",
    url: "https://uainf-auksion.uz",
    siteName: "Universal Auksion Invest",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Universal Auksion Invest Platformasi",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Universal Auksion Invest | Onlayn Savdolar va Lotlar",
    description:
      "Siz qidirgan lotlar endi onlayn auksionda. Savdolarda qatnashing va yutib oling!",
    images: ["/og.jpg"],
  },

  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { ConditionalLayout } from "@/components";

import ReduxProvider from "@/redux/ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ReduxProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
