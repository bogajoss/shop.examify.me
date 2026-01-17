"use client";

import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";

const sidebarLinks = [
  { name: "ওভারভিউ", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "অর্ডারসমূহ", href: "/admin/orders", icon: ShoppingBag },
  { name: "ব্যাচসমূহ", href: "/admin/batches", icon: BookOpen },
  { name: "শিক্ষার্থীবৃন্দ", href: "/admin/students", icon: Users },
  { name: "সেটিংস", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-black text-foreground tracking-tight">
            Examify <span className="text-primary">Admin</span>
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setIsSidebarOpen(false);
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-72 bg-card border-r border-border
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-foreground tracking-tighter">
                Examify
              </h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] -mt-1">
                Control Panel
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <link.icon
                    className={`h-5 w-5 ${isActive ? "text-white" : "opacity-70"}`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Section / Logout */}
          <div className="mt-auto pt-6 border-t border-border">
            <div className="bg-muted/50 rounded-2xl p-4 flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
                A
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-foreground truncate">
                  Admin User
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Master
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-destructive hover:bg-destructive/10 rounded-xl transition-all border border-transparent hover:border-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              লগ আউট করুন
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 md:p-8 lg:p-12">{children}</div>
      </main>
    </div>
  );
}
