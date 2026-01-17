"use client";

import { Clock, Copy, FileText, Key, Phone, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user, approveOrder, redeemToken, isLoading, refreshUser } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");

  // Protect route
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    try {
      // Real Token Verification
      const { data: tokenData, error } = await supabase
        .from("enrollment_tokens")
        .select("*")
        .eq("token", tokenInput.trim())
        .eq("is_used", false)
        .single();

      if (error || !tokenData) {
        showToast("ভুল টোকেন বা টোকেনটি ইতিমধ্যে ব্যবহৃত!", "error");
        return;
      }

      // Check expiry if exists
      if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
        showToast("টোকেনটির মেয়াদ শেষ হয়ে গেছে!", "error");
        return;
      }

      // Enroll student
      const currentBatches = user.enrolledBatches || [];
      if (!currentBatches.includes(tokenData.batch_id)) {
        const { error: enrollError } = await supabase
          .from("users")
          .update({
            enrolled_batches: [...currentBatches, tokenData.batch_id]
          })
          .eq("uid", user.id);
        
        if (enrollError) throw enrollError;

        // Mark token as used
        await supabase
          .from("enrollment_tokens")
          .update({
            is_used: true,
            used_by: user.id,
            used_at: new Date().toISOString(),
            current_uses: (tokenData.current_uses || 0) + 1
          })
          .eq("id", tokenData.id);
      }

      showToast("সফলভাবে এনরোল করা হয়েছে!", "success");
      setTokenInput("");
      refreshUser();
    } catch (error) {
      console.error("Redeem error:", error);
      showToast("টোকেন রিডিম করতে সমস্যা হয়েছে", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("টোকেন কপি করা হয়েছে!");
    });
  };

  const isEnrolled = (courseId: string) =>
    user.enrolledBatches.includes(courseId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 w-full space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4 bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="h-16 w-16 bg-gradient-to-br from-primary to-secondary-foreground rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-inner border-2 border-background">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground text-sm font-mono flex items-center gap-1">
              রোল: {user.roll}
            </p>
          </div>
        </div>

        {/* Token Redemption Area */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Key className="h-5 w-5" />
            টোকেন রিডিম করুন
          </div>
          <form onSubmit={handleRedeem} className="flex gap-2">
            <input
              type="text"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="টোকেন দিন (যেমন: EXM-XXXXXX)"
              className="flex-1 h-11 px-4 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
            />
            <Button type="submit">রিডিম</Button>
          </form>
        </div>

        {/* Course & Order List */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-foreground border-l-4 border-primary pl-3 flex items-center gap-2">
            আমার কোর্স ও অর্ডার তালিকা
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.orders.length > 0 ? (
              user.orders.map((order) => {
                const enrolled = isEnrolled(order.courseId);

                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-base text-foreground line-clamp-1">
                            {order.courseName}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {order.date} • ৳{order.amount}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Approved" ? "success" : 
                            order.status === "Rejected" ? "destructive" : "warning"
                          }
                          className="uppercase tracking-wider text-[10px]"
                        >
                          {order.status}
                        </Badge>
                      </div>

                      {order.status === "Pending" && (
                        <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border text-xs text-secondary-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>পেমেন্ট ভেরিফিকেশনের জন্য অপেক্ষা করুন...</span>
                          </div>
                        </div>
                      )}

                      {order.status === "Rejected" && (
                        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-xs text-destructive">
                           পেমেন্টটি গ্রহণ করা হয়নি। দয়া করে সাপোর্টে যোগাযোগ করুন।
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-3">
                      {/* Show Token if available */}
                      {order.token && (
                        <div className="flex items-center justify-between p-2.5 bg-muted rounded-lg border border-border text-xs group">
                          <span className="text-muted-foreground font-medium">
                            টোকেন:
                          </span>
                          <code className="font-mono font-bold text-primary select-all">
                            {order.token}
                          </code>
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(order.token || "")
                            }
                            className="text-primary hover:text-primary/80 transition-colors"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      {enrolled ? (
                        <Button
                          fullWidth
                          className="gap-2"
                          onClick={() =>
                            router.push(`/classroom/${order.courseId}`)
                          }
                        >
                          <Play className="h-4 w-4 fill-current" /> ক্লাসরুমে যান
                        </Button>
                      ) : order.status === "Approved" && order.token ? (
                        <Button
                          fullWidth
                          className="gap-2 animate-pulse"
                          onClick={async () => {
                             setTokenInput(order.token || "");
                             showToast("টোকেনটি উপরের রিডিম বক্সে সেট করা হয়েছে।", "info");
                          }}
                        >
                          <Key className="h-4 w-4" /> রিডিম করুন
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 border-2 border-dashed border-border rounded-2xl bg-muted/20">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted text-muted-foreground mb-4">
                  <FileText className="h-7 w-7" />
                </div>
                <p className="text-muted-foreground font-medium mb-6">
                  আপনার কোনো অর্ডার বা কোর্স নেই।
                </p>
                <Link href="/#courses">
                  <Button size="lg">কোর্স খুঁজুন</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
