import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default:
      "Universal Auksion Invest | O'zbekistondagi Onlayn Auksion Savdolari",
    template: "%s | Universal Auksion Invest",
  },
  description:
    "Universal Auksion Invest - ko'chmas mulk, avtotransport, qishloq xo'jaligi texnikalari va boshqa ko'plab lotlar bo'yicha shaffof va qonuniy onlayn auksion platformasi.",
  keywords: [
    "auksion",
    "onlayn savdo",
    "lotlar",
    "elektron auksion",
    "savdolashish",
    "auksion uz",
    "ko'chmas mulk auksioni",
    "avtomobillar savdosi",
    "texnika auksioni",
    "uainf-auksion",
    "universal auksion invest",
    "onlayn auksion",
    "auksion savdolari",
    "g'oliblik bayonnomasi",
  ],

  verification: {
    google: "Uww9EX1LtnpqAblF-ydoasnyJm6OwBFG2GbWGaEnXkw",
  },

  metadataBase: new URL("https://www.uainf-auksion.uz"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Universal Auksion Invest - Shaffof Onlayn Savdolar",
    description:
      "O'zbekiston bo'ylab eng yaxshi lotlar va auksion savdolari. Ishtirok eting va o'z mulkingizga ega bo'ling!",
    url: "https://www.uainf-auksion.uz",
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
    title: "Universal Auksion Invest | Onlayn Savdolar",
    description:
      "Siz qidirgan lotlar endi onlayn auksionda. Savdolarda qatnashing va yutib oling!",
    images: ["/og.jpg"],
  },

  icons: {
    icon: [
      { url: "/icon.png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Universal Auksion Invest",
    url: "https://www.uainf-auksion.uz",
  };

  return (
    <html lang="uz" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ReduxProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
