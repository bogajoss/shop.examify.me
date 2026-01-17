"use client";

import { useState, useEffect } from "react";
import { Loader2, GraduationCap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h3 className="font-semibold tracking-tight text-2xl">লগইন</h3>
          <p className="text-sm text-muted-foreground">
            লগইন করতে আপনার রোল বা ফোন নম্বর ও পাসওয়ার্ড দিন
          </p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="roll-number" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                রোল নম্বর / ফোন নম্বর (অফিসিয়ালি রোল না পেলে তোমার ফোন নম্বর দাও)
              </label>
              <input
                id="roll-number"
                type="text"
                placeholder="আপনার রোল বা ফোন নম্বর"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="rounded-lg border border-destructive/50 px-4 py-3 text-destructive bg-destructive/10 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center p-6 pt-0 flex-col gap-4">
            <Button
              type="submit"
              className="w-full hover:scale-105 transition-transform"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              অ্যাকাউন্ট নেই?{" "}
              <Link
                href={`/register${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                className="underline hover:text-primary"
              >
                নিবন্ধন করুন
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}