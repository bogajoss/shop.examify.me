"use client";

import { BookOpen, LayoutDashboard, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { useAdmin } from "@/context/AdminContext";

export default function AdminDashboard() {
  const { admin, isLoading, logout } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push("/admin/login");
    }
  }, [admin, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">লোডিং...</p>
      </div>
    );
  }

  if (!admin) return null;

  const stats = [
    { label: "মোট শিক্ষার্থী", value: "১,২৩৪", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "সক্রিয় ব্যাচ", value: "১২", icon: LayoutDashboard, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "মোট এক্সাম", value: "৪৫", icon: BookOpen, color: "text-green-600", bg: "bg-green-100" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ড্যাশবোর্ড ওভারভিউ</h2>
          <p className="text-sm text-muted-foreground">স্বাগতম, {admin.name}!</p>
        </div>
        <div className="md:hidden">
            <Button size="sm" variant="outline" onClick={() => logout()}>
              লগ আউট
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-foreground">সাম্প্রতিক কার্যক্রম</h3>
        </div>
        <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center justify-center gap-2">
            <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center mb-2">
                <LayoutDashboard className="h-5 w-5 opacity-50" />
            </div>
           কোনো সাম্প্রতিক কার্যক্রম নেই।
        </div>
      </div>
    </div>
  );
}
