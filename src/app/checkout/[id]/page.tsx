"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Copy } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const checkoutSchema = z.object({
  senderPhone: z.string().min(11, "সঠিক ফোন নাম্বার দিন (১১ ডিজিট)"),
  trxId: z.string().min(6, "সঠিক TrxID দিন (কমপক্ষে ৬ ডিজিট)"),
  paymentMethod: z.enum(["bKash", "Nagad", "Rocket"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { id } = useParams();
  const router = useRouter();
  const { user, submitOrder, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [isCourseLoading, setIsCourseLoading] = useState(true);

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

  if (isAuthLoading || isCourseLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!course) return null;

  const onSubmit = async (data: CheckoutFormValues) => {
    if (!user) {
      showToast("অর্ডার করার আগে লগইন করুন।", "error");
      router.push("/login");
      return;
    }

    try {
      await submitOrder(course, {
        paymentMethod: data.paymentMethod,
        paymentNumber: data.senderPhone,
        trxId: data.trxId
      });
      showToast("অর্ডার জমা হয়েছে! ভেরিফিকেশনের জন্য অপেক্ষা করুন।", "info");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "অর্ডার সাবমিট করতে সমস্যা হয়েছে";
      showToast(message, "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Number copied: ${text}`);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:pt-14 flex-1 w-full">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="rounded-lg bg-card text-card-foreground shadow-sm border-[3px] border-primary/20">
          <div className="flex flex-col p-6 space-y-1 pb-3 border-b border-border/50">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Payment instructions
            </p>
            <h3 className="font-semibold tracking-tight text-xl">
              Buy {course.title}
            </h3>
            <p className="text-muted-foreground text-xs">
              Complete payment & get token.
            </p>
          </div>

          <div className="p-6 space-y-6 text-sm">
            <div className="text-center py-6 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-muted-foreground text-xs uppercase tracking-widest mb-1">
                Total Payable Amount
              </p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-primary">
                  ৳{course.price}
                </span>
              </div>
            </div>

            <div className="bg-card p-4 rounded-lg space-y-4 border border-border">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                Select Payment Method & Send Money
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                {/* bKash */}
                <div 
                  onClick={() => setValue("paymentMethod", "bKash")}
                  className={`relative bg-[#e2136e]/5 border rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all ${selectedMethod === "bKash" ? "border-[#e2136e] ring-2 ring-[#e2136e]/20" : "border-[#e2136e]/30 hover:border-[#e2136e]"}`}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#e2136e]">
                      bKash Personal
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard("01973577899"); }}
                      className="text-[#e2136e]/70"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">
                      01973577899
                    </span>
                  </div>
                  {selectedMethod === "bKash" && <div className="absolute top-2 right-2 w-3 h-3 bg-[#e2136e] rounded-full" />}
                </div>

                {/* Nagad */}
                <div 
                   onClick={() => setValue("paymentMethod", "Nagad")}
                   className={`relative bg-[#f6921e]/5 border rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all ${selectedMethod === "Nagad" ? "border-[#f6921e] ring-2 ring-[#f6921e]/20" : "border-[#f6921e]/30 hover:border-[#f6921e]"}`}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#f6921e]">
                      Nagad Personal
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard("01754365403"); }}
                      className="text-[#f6921e]/70"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">
                      01754365403
                    </span>
                  </div>
                   {selectedMethod === "Nagad" && <div className="absolute top-2 right-2 w-3 h-3 bg-[#f6921e] rounded-full" />}
                </div>

                {/* Rocket */}
                <div 
                   onClick={() => setValue("paymentMethod", "Rocket")}
                   className={`relative bg-[#8c3494]/5 border rounded-xl p-4 flex flex-col items-center gap-3 cursor-pointer transition-all ${selectedMethod === "Rocket" ? "border-[#8c3494] ring-2 ring-[#8c3494]/20" : "border-[#8c3494]/30 hover:border-[#8c3494]"}`}
                >
                  <div className="w-full flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#8c3494]">
                      Rocket Personal
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); copyToClipboard("019735778997"); }}
                      className="text-[#8c3494]/70"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="text-center">
                    <span className="font-mono text-sm font-bold tracking-wide">
                      019735778997
                    </span>
                  </div>
                   {selectedMethod === "Rocket" && <div className="absolute top-2 right-2 w-3 h-3 bg-[#8c3494] rounded-full" />}
                </div>
              </div>
              {errors.paymentMethod && (
                 <p className="text-center text-[10px] text-destructive font-medium mt-2">
                   {errors.paymentMethod.message}
                 </p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                Submit Details
              </div>

              {user ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="ml-4 sm:ml-8 space-y-4"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="senderPhone"
                      className="text-xs font-medium text-foreground/70"
                    >
                      যে নাম্বার থেকে টাকা পাঠিয়েছেন ({selectedMethod || "..."})
                    </label>
                    <div className="flex flex-col gap-1">
                      <input
                        id="senderPhone"
                        type="tel"
                        {...register("senderPhone")}
                        placeholder="01XXXXXXXXX"
                        className={`flex h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono ${errors.senderPhone ? "border-destructive" : ""}`}
                      />
                      {errors.senderPhone && (
                        <p className="text-[10px] text-destructive font-medium">
                          {errors.senderPhone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="trxId"
                      className="text-xs font-medium text-foreground/70"
                    >
                      TrxID
                    </label>
                    <div className="flex flex-col gap-1">
                      <input
                        id="trxId"
                        type="text"
                        {...register("trxId")}
                        placeholder="Transaction ID"
                        className={`flex h-12 sm:h-10 w-full rounded-md border border-input bg-background px-3 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-primary font-mono ${errors.trxId ? "border-destructive" : ""}`}
                      />
                      {errors.trxId && (
                        <p className="text-[10px] text-destructive font-medium">
                          {errors.trxId.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "প্রসেসিং..." : "অর্ডার কনফার্ম করুন"}
                  </Button>
                </form>
              ) : (
                <div className="ml-4 sm:ml-8 text-center py-8 border-2 border-dashed border-border rounded-lg bg-muted/20">
                  <p className="mb-4 font-medium text-foreground">
                    অর্ডার করার জন্য লগইন প্রয়োজন।
                  </p>
                  <Button type="button" onClick={() => router.push("/login")}>
                    Login Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
