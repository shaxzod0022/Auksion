"use client";

import { usePathname } from "next/navigation";
import { Navbar, Footer } from "@/components";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isAuction = pathname.startsWith("/auction");

  if (isAdmin || isAuction) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
