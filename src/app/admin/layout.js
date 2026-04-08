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
} from "lucide-react";
import "./admin-layout.css";
import { useEffect } from "react";

function AdminLayoutContent({ children }) {
  const { admin, loading, logout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [admin, loading, isLoginPage, router]);

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
    return null; // Redirecting in useEffect
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
                className={`admin-nav-item ${pathname === item.path ? "active" : ""}`}
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
