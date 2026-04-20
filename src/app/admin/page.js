"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getDashboardStats } from "@/services/adminService";
import {
  Users,
  ClipboardList,
  FolderTree,
  Package,
  Newspaper,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function AdminPage() {
  const { admin } = useAdminAuth();
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboardStats();
      if (data) {
        setStatsData(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const stats = [
    {
      name: "Adminlar",
      value: statsData?.admins || 0,
      icon: ShieldCheck,
      color: "#6366f1",
    },
    {
      name: "Foydalanuvchilar",
      value: statsData?.users || 0,
      icon: Users,
      color: "#38bdf8",
    },
    {
      name: "Lotlar",
      value: statsData?.lots || 0,
      icon: ClipboardList,
      color: "#4ade80",
    },
    {
      name: "Kategoriyalar",
      value: statsData?.categories || 0,
      icon: FolderTree,
      color: "#fbbf24",
    },
    {
      name: "Lot turlari",
      value: statsData?.lotTypes || 0,
      icon: Package,
      color: "#f87171",
    },
    {
      name: "Yangiliklar",
      value: statsData?.news || 0,
      icon: Newspaper,
      color: "#a855f7",
    },
    {
      name: "Xabarlar",
      value: statsData?.contacts || 0,
      icon: MessageSquare,
      color: "#ec4899",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader2
          className="animate-spin"
          size={40}
          color="var(--admin-accent)"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Xush kelibsiz, {admin?.firstName}!</h1>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "3rem",
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem",
              }}
            >
              <div
                style={{
                  background: `${stat.color}15`,
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  color: stat.color,
                }}
              >
                <Icon size={24} />
              </div>
              <div>
                <p
                  style={{
                    color: "var(--admin-text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    marginBottom: "0.125rem",
                  }}
                >
                  {stat.name}
                </p>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "800",
                    color: "var(--admin-text-dark)",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
