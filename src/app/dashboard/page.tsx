"use client";

import { Clock, Copy, FileText, Key, Phone, Play } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user, approveOrder, redeemToken } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [tokenInput, setTokenInput] = useState("");

  // Protect route
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemToken(tokenInput)) {
      showToast("সফলভাবে এনরোল করা হয়েছে!", "success");
      setTokenInput("");
    } else {
      showToast("ভুল টোকেন বা টোকেনটি একটিভ নয়!", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("টোকেন কপি করা হয়েছে!");
    });
  };

  const isEnrolled = (courseId: string) =>
    user.enrolledCourses.some((c) => c.id === courseId);

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
              <Phone className="h-3.5 w-3.5" />
              {user.phone}
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
              placeholder="EXM-XXXXXX"
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
                    className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-base text-foreground line-clamp-1">
                          {order.courseName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {order.date} • ৳{order.amount}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === "Approved"
                            ? "bg-secondary text-primary border border-primary/20"
                            : "bg-accent text-accent-foreground border border-accent-foreground/10"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {order.status === "Pending" ? (
                      <div className="mt-4 p-3 bg-accent/30 rounded-lg border border-accent/50 text-xs text-accent-foreground space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5" />
                          <span>অ্যাডমিন ভেরিফিকেশনের জন্য অপেক্ষা করুন...</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          fullWidth
                          className="h-8 text-[10px] border-accent/50 hover:bg-accent/50"
                          onClick={() => approveOrder(order.id)}
                        >
                          Simulate Admin Approve
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {enrolled ? (
                          <Button
                            fullWidth
                            className="gap-2"
                            onClick={() =>
                              router.push(`/classroom/${order.courseId}`)
                            }
                          >
                            <Play className="h-4 w-4 fill-current" /> ক্লাস করুন
                          </Button>
                        ) : (
                          <div className="space-y-2">
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
                            <Button
                              fullWidth
                              className="gap-2 animate-pulse"
                              onClick={() => {
                                if (order.token) redeemToken(order.token);
                                showToast("সফলভাবে এনরোল করা হয়েছে!", "success");
                              }}
                            >
                              <Key className="h-4 w-4" /> এনরোল করুন
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
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
