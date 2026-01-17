"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  LayoutDashboard,
  TrendingUp,
  Users,
} from "lucide-react";
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
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">
            ড্যাশবোর্ড লোড হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!admin) return null;

  const stats = [
    {
      label: "মোট শিক্ষার্থী",
      value: "১,২৩৪",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+১২% এই মাসে",
    },
    {
      label: "সক্রিয় ব্যাচ",
      value: "১২",
      icon: LayoutDashboard,
      color: "text-purple-600",
      bg: "bg-purple-100",
      trend: "৪টি নতুন ব্যাচ",
    },
    {
      label: "মোট এক্সাম",
      value: "৪৫",
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: "+৮টি এই সপ্তাহে",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-0">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            ড্যাশবোর্ড
          </h2>
          <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
            স্বাগতম, <span className="text-primary font-bold">{admin.name}</span>!
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="hidden sm:flex"
            onClick={() => logout()}
          >
            লগ আউট
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1 sm:flex-none h-11 sm:h-10 rounded-xl sm:rounded-lg font-bold"
          >
            নতুন ব্যাচ তৈরি করুন
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4 hover:shadow-xl hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-4xl font-black text-foreground mt-1 tracking-tighter">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 sm:px-0">
        {/* Recent Orders Link */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push("/admin/orders")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              router.push("/admin/orders");
          }}
          className="bg-primary p-8 rounded-[2rem] text-primary-foreground shadow-xl shadow-primary/20 flex flex-col justify-between min-h-[220px] cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/20 transition-all" />
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight">পেন্ডিং অর্ডার</h3>
            <p className="text-primary-foreground/70 font-medium">
              নতুন পেমেন্ট রিকোয়েস্টগুলো দ্রুত ভেরিফাই করুন।
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-4 border-primary bg-primary-foreground/10 flex items-center justify-center text-xs font-bold"
                >
                  S{i}
                </div>
              ))}
              <div className="h-10 w-10 rounded-full border-4 border-primary bg-primary-foreground/20 flex items-center justify-center text-xs font-bold">
                +৫
              </div>
            </div>
            <div className="h-12 w-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg group-hover:translate-x-2 transition-transform">
              <ArrowRight className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="bg-card rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="font-black text-xl text-foreground flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" /> সাম্প্রতিক কার্যক্রম
            </h3>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              আজ
            </span>
          </div>
          <div className="flex-1 p-10 text-center flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-muted/50 rounded-3xl flex items-center justify-center mb-2">
              <LayoutDashboard className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <div className="space-y-1">
              <p className="text-foreground font-bold">কোনো কার্যক্রম নেই</p>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                নতুন কার্যক্রম শুরু হলে তা এখানে দেখা যাবে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
