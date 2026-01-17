"use client";

import { LayoutDashboard, Users, BookOpen, Settings, LogOut, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/context/AdminContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin, logout } = useAdmin();
  const pathname = usePathname();

  // If not on an admin page (e.g. login), just render children
  // But typically layout wraps all /admin routes.
  // We can check if it's the login page to exclude the sidebar.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!admin) return null; // content protection is handled by middleware/page logic

  const navItems = [
    { label: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "অর্ডার সমূহ", href: "/admin/orders", icon: ShoppingCart },
    { label: "শিক্ষার্থী", href: "/admin/students", icon: Users },
    { label: "ব্যাচ ও এক্সাম", href: "/admin/batches", icon: BookOpen },
    { label: "সেটিংস", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col fixed inset-y-0 z-50">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">Examify Admin</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border bg-muted/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {admin.name}
              </p>
              <p className="text-xs text-muted-foreground truncate capitalize">
                {admin.role}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" />
            লগ আউট করুন
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
