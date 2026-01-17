"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAdmin } from "@/context/AdminContext";

const loginSchema = z.object({
  username: z.string().min(1, "ইউজারনেম প্রয়োজন"),
  password: z.string().min(1, "পাসওয়ার্ড প্রয়োজন"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const { admin, login } = useAdmin();
  const { showToast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (admin) {
      router.push("/admin/dashboard");
    }
  }, [admin, router]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password);
      showToast("এডমিন লগইন সফল হয়েছে!", "success");
      router.push("/admin/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "লগইন ব্যর্থ হয়েছে";
      showToast(message, "error");
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary">
              এডমিন লগইন
            </h1>
            <p className="text-xs text-muted-foreground">
              এডমিন প্যানেলে প্রবেশ করতে আপনার ক্রেডেনশিয়াল দিন
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-xs font-medium text-foreground/70"
                >
                  ইউজারনেম
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className={`flex h-12 w-full rounded-lg border border-input bg-background px-4 text-base focus:ring-2 focus:ring-primary focus:outline-none ${errors.username ? "border-destructive" : ""}`}
                  placeholder="admin"
                />
                {errors.username && (
                  <p className="text-[10px] text-destructive font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-foreground/70"
                >
                  পাসওয়ার্ড
                </label>
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
              {isSubmitting ? "প্রসেসিং..." : "লগইন করুন"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
