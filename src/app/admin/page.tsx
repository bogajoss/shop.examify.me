"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdmin } from "@/context/AdminContext";

export default function AdminRoot() {
  const { admin, isLoading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (admin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [admin, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}
