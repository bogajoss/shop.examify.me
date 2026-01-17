"use client";

import {
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  User as UserIcon,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: signUp } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না");
      setLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("পাসওয়ার্ড কমপক্ষে ৪টি অক্ষরের হতে হবে");
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.name, formData.roll, formData.password);
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (err: any) {
      setError(err.message || "নিবন্ধন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transform -rotate-6">
              <UserPlus className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              নতুন অ্যাকাউন্ট
            </h1>
            <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
              নিচে আপনার সঠিক তথ্য দিয়ে দ্রুত নিবন্ধন সম্পন্ন করুন
            </p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="px-8 pb-10 space-y-5">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                আপনার নাম
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="আপনার পূর্ণ নাম"
                  className="flex h-13 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="roll"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                রোল / ফোন নম্বর
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <input
                  id="roll"
                  type="text"
                  placeholder="আপনার রোল বা ফোন নম্বর"
                  className="flex h-13 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={formData.roll}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  পাসওয়ার্ড
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••"
                    className="flex h-13 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                >
                  নিশ্চিত করুন
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••"
                    className="flex h-13 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 px-4 py-3 text-destructive bg-destructive/5 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}
          </div>

          <div className="pt-2 space-y-6">
            <Button
              type="submit"
              size="lg"
              fullWidth
              className="h-14 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  নিবন্ধন হচ্ছে...
                </>
              ) : (
                "নিবন্ধন সম্পন্ন করুন"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground font-medium">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              </span>
              <Link
                href={`/login${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                className="text-primary font-black hover:underline underline-offset-4"
              >
                লগইন করুন
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
