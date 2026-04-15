"use client";

import { useAdminAuth, AdminAuthProvider } from "@/context/AdminAuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  Newspaper,
  FolderTree,
  ClipboardList,
  MapPin,
  FileText,
} from "lucide-react";
import "./admin-layout.css";
import { useEffect } from "react";

function AdminLayoutContent({ children }) {
  const { admin, loading, logout } = useAdminAuth();
  const rawPathname = usePathname();
  const pathname = rawPathname.replace(/\/$/, "") || "/";
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    console.log("AdminLayout useEffect:", { 
      rawPathname, 
      normalizedPathname: pathname, 
      loading, 
      admin: !!admin, 
      isLoginPage 
    });
    if (!loading && !admin && !isLoginPage) {
      console.log("Redirecting to /admin/login...");
      router.replace("/admin/login");
    }
  }, [admin, loading, isLoginPage, router, rawPathname, pathname]);

  if (loading) {
    return (
      <div
        className="admin-container"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        Loading...
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!admin) {
    return (
      <div className="admin-container" style={{ justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Login sahifasiga yo'naltirilmoqda...</p>
      </div>
    );
  }

  const navItems = [
    { name: "Asosiy", icon: LayoutDashboard, path: "/admin" },
    {
      name: "Adminlar",
      icon: Users,
      path: "/admin/users/admins",
      role: "superadmin",
    },
    { name: "Foydalanuvchilar", icon: Users, path: "/admin/users/members" },
    { name: "Lotlar", icon: ClipboardList, path: "/admin/lots" },
    { name: "Bayonnomalar", icon: FileText, path: "/admin/protocols" },
    { name: "Kategoriyalar", icon: FolderTree, path: "/admin/category" },
    { name: "Lot toifalari", icon: Package, path: "/admin/lots-types" },
    { name: "Viloyatlar", icon: MapPin, path: "/admin/provinces" },
    { name: "Tuman/Shaharlar", icon: MapPin, path: "/admin/regions" },
    { name: "Yangiliklar", icon: Newspaper, path: "/admin/news" },
    { name: "Murojaatlar", icon: Settings, path: "/admin/contact" },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.role || item.role === admin.role,
  );

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-logo">AUKSION ADMIN</div>
        <nav className="admin-nav">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`admin-nav-item ${pathname === item.path.replace(/\/$/, "") ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="admin-nav-item"
            style={{
              marginTop: "auto",
              border: "none",
              background: "transparent",
              width: "100%",
              textAlign: "left",
            }}
          >
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </nav>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminAuthProvider>
  );
}
