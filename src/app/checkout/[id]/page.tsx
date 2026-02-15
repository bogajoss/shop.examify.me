"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Info,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

const checkoutSchema = z.object({
  senderPhone: z.string().min(11, "সঠিক ফোন নম্বর দিন (১১ ডিজিট)"),
  trxId: z.string().min(6, "সঠিক TrxID দিন (কমপক্ষে ৬ ডিজিট)"),
  paymentMethod: z.enum(["bKash", "Nagad", "Rocket"], {
    message: "পেমেন্ট মেথড সিলেক্ট করুন",
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { id } = useParams();
  const router = useRouter();
  const { user, submitOrder, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [isCourseLoading, setIsCourseLoading] = useState(true);

  const existingOrder = user?.orders?.find((o) => o.courseId === id);

  useEffect(() => {
    async function fetchCourse() {
      try {
        const { data, error } = await supabase
          .from("batches")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setCourse({
          id: data.id,
          title: data.name,
          price: data.price,
          oldPrice: data.old_price,
          batchId: data.id,
        });
      } catch (err) {
        console.error("Error fetching course:", err);
        showToast("কোর্স খুঁজে পাওয়া যায়নি।", "error");
      } finally {
        setIsCourseLoading(false);
      }
    }
    fetchCourse();
  }, [id, showToast]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      senderPhone: "",
      trxId: "",
      paymentMethod: undefined,
    },
  });

  const selectedMethod = watch("paymentMethod");

  if (isAuthLoading || isCourseLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );

  if (!course) return null;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
      showToast("অর্ডার করার আগে লগইন করুন।", "error");
      router.push(`/login?redirect=/checkout/${id}`);
      return;
    }

    if (
      existingOrder &&
      (existingOrder.status === "Pending" ||
        existingOrder.status === "Approved")
    ) {
      showToast("আপনার একটি অর্ডার ইতিমধ্যে প্রসেসিং অবস্থায় আছে।", "info");
      return;
    }

    try {
      await submitOrder(course, {
        paymentMethod: data.paymentMethod,
        paymentNumber: data.senderPhone,
        trxId: data.trxId,
      });
      showToast("অর্ডার জমা হয়েছে! ভেরিফিকেশনের জন্য অপেক্ষা করুন।", "success");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "অর্ডার সাবমিট করতে সমস্যা হয়েছে";
      showToast(message, "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`নম্বর কপি করা হয়েছে: ${text}`);
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-6 sm:pt-10 flex-1 w-full space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 px-1"
        >
          <ArrowLeft className="h-4 w-4" /> ফিরে যান
        </button>

        <div className="rounded-3xl bg-card border border-border shadow-xl overflow-hidden">
          {/* Header Summary */}
          <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                  Checkout Summary
                </p>
                <h3 className="font-black text-xl sm:text-2xl text-foreground leading-tight">
                  {course.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold text-destructive line-through decoration-2">
                  ৳{course.oldPrice}
                </p>
                <p className="text-2xl font-black text-primary">
                  ৳{course.price}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="bg-white/50 dark:bg-black/20 border-primary/10 text-primary text-[10px] font-bold py-1"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" /> Until Exam Ends
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/50 dark:bg-black/20 border-primary/10 text-primary text-[10px] font-bold py-1"
              >
                <ShieldCheck className="h-3 w-3 mr-1" /> Secure Payment
              </Badge>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {existingOrder && existingOrder.status === "Pending" ? (
              <div className="text-center py-10 bg-amber-50 dark:bg-amber-950/20 rounded-3xl border border-dashed border-amber-200 dark:border-amber-900/50 space-y-4">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
                  <Clock className="h-8 w-8 animate-pulse" />
                </div>
                <div className="space-y-2 px-4">
                  <h3 className="text-xl font-black text-amber-700 dark:text-amber-400">
                    অর্ডার পেন্ডিং আছে
                  </h3>
                  <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
                    আপনার এই কোর্সের পেমেন্টটি বর্তমানে ভেরিফিকেশনের জন্য পেন্ডিং অবস্থায়
                    আছে। অ্যাডমিন অ্যাপ্রুভ করলে আপনি ড্যাশবোর্ড থেকে কোর্সে এক্সেস পাবেন।
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-amber-600/20"
                >
                  ড্যাশবোর্ড দেখুন
                </Button>
              </div>
            ) : existingOrder && existingOrder.status === "Approved" ? (
              <div className="text-center py-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-dashed border-emerald-200 dark:border-emerald-900/50 space-y-4">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-2 px-4">
                  <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                    আপনি ইতিমধ্যে এনরোলড!
                  </h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-500 font-medium">
                    এই কোর্সে আপনার এক্সেস ইতিমধ্যে সচল করা হয়েছে। এখনই ক্লাস ও পরীক্ষা
                    শুরু করতে পারেন।
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-emerald-600/20"
                >
                  ক্লাস শুরু করুন
                </Button>
              </div>
            ) : (
              <>
                {/* Step 1 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                      1
                    </div>
                    <h4 className="font-black text-foreground">
                      Payment করুন (সেন্ড মানি)
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "bKash",
                        label: "bKash",
                        num: "01716840429",
                        logo: "https://wp.logos-download.com/wp-content/uploads/2022/01/BKash_Logo_icon-700x662.png",
                        bg: "bg-[#e2136e]/5",
                      },
                      {
                        id: "Nagad",
                        label: "Nagad",
                        num: "01716840429",
                        logo: "https://freelogopng.com/images/1679248342nagad.png",
                        bg: "bg-[#f6921e]/5",
                      },
                      {
                        id: "Rocket",
                        label: "Rocket",
                        num: "01716840429",
                        logo: "https://static.vecteezy.com/system/resources/previews/068/706/013/non_2x/rocket-color-logo-mobile-banking-icon-free-png.png",
                        bg: "bg-[#8c3494]/5",
                      },
                    ].map((method) => (
                      <div
                        key={method.id}
                        role="button"
                        tabIndex={0}
                        onClick={() =>
                          setValue("paymentMethod", method.id as any)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ")
                            setValue("paymentMethod", method.id as any);
                        }}
                        className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                          selectedMethod === method.id
                            ? "bg-white dark:bg-white/5 shadow-lg border-foreground ring-4 ring-primary/5"
                            : "bg-muted/30 border-transparent hover:border-primary/20 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <img
                            src={method.logo}
                            alt={method.label}
                            className="h-6 w-auto object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(method.num);
                            }}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-mono text-sm font-black tracking-tight text-foreground truncate">
                          {method.num}
                        </p>
                        {selectedMethod === method.id && (
                          <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1 shadow-md">
                            <CheckCircle2 className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-[11px] text-destructive font-bold flex items-center gap-1.5 ml-1 animate-pulse">
                      <Info className="h-3 w-3" />{" "}
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                {/* Step 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                      2
                    </div>
                    <h4 className="font-black text-foreground">
                      পেমেন্ট ডিটেইলস দিন
                    </h4>
                  </div>

                  {user ? (
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                    >
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="paymentMethod"
                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                          >
                            পেমেন্ট মেথড সিলেক্ট করুন
                          </label>
                          <div className="relative group">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                            <select
                              id="paymentMethod"
                              {...register("paymentMethod")}
                              className="w-full h-14 bg-muted/30 border border-border rounded-2xl pl-12 pr-4 text-base font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                            >
                              <option value="">সিলেক্ট করুন...</option>
                              <option value="bKash">bKash (বিকাশ)</option>
                              <option value="Nagad">Nagad (নগদ)</option>
                              <option value="Rocket">Rocket (রকেট)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg
                                className="h-5 w-5 text-muted-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </div>
                          {errors.paymentMethod && (
                            <p className="text-[10px] text-destructive font-bold ml-1">
                              {errors.paymentMethod.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label
                              htmlFor="senderPhone"
                              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              বিকাশ/নগদ নম্বর
                            </label>
                            <div className="relative group">
                              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <input
                                id="senderPhone"
                                type="tel"
                                {...register("senderPhone")}
                                placeholder="01XXXXXXXXX"
                                className="w-full h-14 bg-muted/30 border border-border rounded-2xl pl-12 pr-4 text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            </div>
                            {errors.senderPhone && (
                              <p className="text-[10px] text-destructive font-bold ml-1">
                                {errors.senderPhone.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor="trxId"
                              className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1"
                            >
                              Transaction ID (TrxID)
                            </label>
                            <div className="relative group">
                              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                              <input
                                id="trxId"
                                type="text"
                                {...register("trxId")}
                                placeholder="TrxID"
                                className="w-full h-14 bg-muted/30 border border-border rounded-2xl pl-12 pr-4 text-base font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                              />
                            </div>
                            {errors.trxId && (
                              <p className="text-[10px] text-destructive font-bold ml-1">
                                {errors.trxId.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        className="h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            অর্ডার প্রসেসিং...
                          </div>
                        ) : (
                          "পেমেন্ট সম্পন্ন করুন"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-10 bg-muted/30 rounded-3xl border border-dashed border-border space-y-4">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                        <Smartphone className="h-6 w-6" />
                      </div>
                      <div className="space-y-1 px-4">
                        <p className="font-bold text-foreground">
                          অর্ডার করার জন্য লগইন প্রয়োজন
                        </p>
                        <p className="text-xs text-muted-foreground">
                          পেমেন্ট সাবমিট করার আগে আপনার অ্যাকাউন্টে লগইন করে নিন।
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() =>
                          router.push(`/login?redirect=/checkout/${id}`)
                        }
                        className="rounded-xl px-8 h-11 font-bold"
                      >
                        লগইন করুন
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Safety Note */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            100% Secure & Verified Payment
          </span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
