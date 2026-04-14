"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UsersOverview() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/users/admins");
  }, [router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--admin-text-muted)' }}>Redirecting...</p>
    </div>
  );
}
