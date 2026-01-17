"use client";

import { useState } from "react";
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

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
      // useAuth.register typically handles redirection or we do it here?
      // Based on current logic, useAuth handles toast but maybe not redirect?
      // I'll redirect manually just in case.
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (err: any) {
      setError(err.message || "নিবন্ধন ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-in fade-in duration-500 py-8">
      <div className="w-full max-w-sm rounded-xl border bg-card text-card-foreground shadow-lg animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="font-bold text-2xl text-primary">নতুন অ্যাকাউন্ট</h3>
          <p className="text-sm text-muted-foreground">
            অ্যাকাউন্ট তৈরি করতে নিচের তথ্যগুলো দিন
          </p>
        </div>
        
        <form onSubmit={handleRegister}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                আপনার নাম
              </label>
              <input
                id="name"
                type="text"
                placeholder="আপনার পূর্ণ নাম"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="roll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                রোল নম্বর / ফোন নম্বর (অফিসিয়ালি রোল না পেলে তোমার ফোন নম্বর দাও)
              </label>
              <input
                id="roll"
                type="text"
                placeholder="আপনার রোল বা ফোন নম্বর"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.roll}
                onChange={handleChange}
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
                placeholder="একটি শক্তিশালী পাসওয়ার্ড দিন"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="পাসওয়ার্ডটি পুনরায় লিখুন"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              className="w-full font-semibold text-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  নিবন্ধন হচ্ছে...
                </>
              ) : (
                "নিবন্ধন করুন"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
              <Link
                href={`/login${searchParams.get("redirect") ? `?redirect=${searchParams.get("redirect")}` : ""}`}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                লগইন করুন
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
