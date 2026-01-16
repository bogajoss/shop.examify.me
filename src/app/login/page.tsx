"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  roll: z.string().min(4, "সঠিক রোল/আইডি দিন"),
  password: z.string().min(4, "পাসওয়ার্ড কমপক্ষে ৪ ডিজিটের হতে হবে"),
});

const registerSchema = z.object({
  name: z.string().min(3, "নাম কমপক্ষে ৩ অক্ষরের হতে হবে"),
  roll: z.string().min(4, "সঠিক রোল/আইডি দিন"),
  password: z.string().min(4, "পাসওয়ার্ড কমপক্ষে ৪ ডিজিটের হতে হবে"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function LoginPage() {
  const { user, login, register: signUp } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema) as any,
    defaultValues: {
      name: "",
      roll: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      if (isLogin) {
        await login(data.roll, data.password);
        showToast("লগইন সফল হয়েছে!", "success");
      } else {
        await signUp(data.name, data.roll, data.password);
        showToast("রেজিস্ট্রেশন সফল হয়েছে!", "success");
      }
      router.push("/dashboard");
    } catch (error: any) {
      showToast(error.message || "একটি সমস্যা হয়েছে!", "error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 bg-muted/10 relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-xl space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              {isLogin ? (
                <LogIn className="h-6 w-6" />
              ) : (
                <UserPlus className="h-6 w-6" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-primary">
              {isLogin ? "লগইন" : "রেজিস্ট্রেশন"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isLogin
                ? "রোল/আইডি ও পাসওয়ার্ড দিয়ে একাউন্টে প্রবেশ করুন"
                : "নতুন একাউন্ট খুলতে নিচের তথ্যগুলো দিন"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-medium text-foreground/70"
                  >
                    পূর্ণ নাম
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none ${errors.name ? "border-destructive" : ""}`}
                    placeholder="আপনার নাম"
                  />
                  {errors.name && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="roll"
                  className="text-xs font-medium text-foreground/70"
                >
                  রোল / আইডি
                </label>
                <input
                  id="roll"
                  type="text"
                  {...register("roll")}
                  className={`flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none font-mono ${errors.roll ? "border-destructive" : ""}`}
                  placeholder="ID-XXXXX"
                />
                {errors.roll && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.roll.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-foreground/70"
                  >
                    পাসওয়ার্ড
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                    >
                      ভুলে গেছেন?
                    </button>
                  )}
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none ${errors.password ? "border-destructive" : ""}`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="gap-2 shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "প্রসেসিং..."
                : isLogin
                  ? "লগইন করুন"
                  : "রেজিস্ট্রেশন করুন"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            {isLogin ? "একাউন্ট নেই? " : "আগেই একাউন্ট আছে? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline"
            >
              {isLogin ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
