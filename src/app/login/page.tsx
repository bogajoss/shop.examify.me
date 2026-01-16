"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  phone: z.string().min(11, "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)"),
  password: z.string().min(4, "পাসওয়ার্ড কমপক্ষে ৪ ডিজিটের হতে হবে"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = (data: LoginFormValues) => {
    login(data.phone);
    showToast("লগইন সফল হয়েছে!");
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 bg-muted/10 relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-8 shadow-xl space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <LogIn className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary">লগইন</h1>
            <p className="text-xs text-muted-foreground">
              ফোন নাম্বার ও পাসওয়ার্ড দিয়ে একাউন্টে প্রবেশ করুন
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-xs font-medium text-foreground/70"
                >
                  ফোন নাম্বার
                </label>
                <div className="flex flex-col gap-1">
                  <div className="flex h-12">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm font-mono font-medium">
                      +88
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      className={`flex-1 h-full rounded-r-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none font-mono ${errors.phone ? "border-destructive" : ""}`}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-foreground/70"
                  >
                    পাসওয়ার্ড
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                  >
                    ভুলে গেছেন?
                  </button>
                </div>
                <div className="flex flex-col gap-1">
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
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              className="gap-2 shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "প্রসেসিং..." : "লগইন করুন"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            একাউন্ট নেই?{" "}
            <button
              type="button"
              className="text-primary font-bold hover:underline"
            >
              রেজিস্ট্রেশন করুন
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
