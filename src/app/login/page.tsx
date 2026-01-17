"use client";

import {
  AlertCircle,
  GraduationCap,
  Loader2,
  Lock,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("migrated") === "true") {
      const redirect = searchParams.get("redirect");
      const url = `/register?migrated=true${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`;
      router.replace(url);
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const redirectTo = searchParams.get("redirect");
      await login(rollNumber, password);
      router.push(redirectTo || "/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("লগইন ব্যর্থ হয়েছে। আপনার রোল এবং পাসওয়ার্ড চেক করুন।");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transform rotate-6">
              <GraduationCap className="h-10 w-10" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              স্বাগতম
            </h1>
            <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
              আপনার অ্যাকাউন্টে লগইন করতে নিচের তথ্যগুলো দিন
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="px-8 sm:px-10 pb-10 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="roll-number"
                className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
              >
                রোল / ফোন নম্বর
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <UserIcon className="h-5 w-5" />
                </div>
                <input
                  id="roll-number"
                  type="text"
                  placeholder="আপনার রোল বা ফোন নম্বর"
                  className="flex h-14 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
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
                  placeholder="••••••••"
                  className="flex h-14 w-full rounded-2xl border border-border bg-muted/30 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-destructive/20 px-4 py-3 text-destructive bg-destructive/5 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
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
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground font-medium">
                অ্যাকাউন্ট নেই?{" "}
              </span>
              <Link
                href={`/register${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                className="text-primary font-black hover:underline underline-offset-4"
              >
                নিবন্ধন করুন
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
