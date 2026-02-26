"use client";

import {
  Clock,
  FileText,
  Hash,
  MessageCircle,
  Play,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

function Linkify({ text }: { text: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.match(urlRegex)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold break-all"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse font-medium">
            লোড হচ্ছে...
          </p>
        </div>
      </div>
    );

  if (!user) return null;

  const isEnrolled = (courseId: string) =>
    user.enrolledBatches.includes(courseId);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-6 sm:py-10 w-full space-y-6 sm:space-y-10">
        {/* Profile Header */}
        <div className="relative overflow-hidden bg-card p-5 sm:p-8 rounded-2xl border border-border shadow-sm group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gradient-to-br from-primary to-primary-foreground rounded-3xl flex items-center justify-center text-white text-3xl sm:text-4xl font-black shrink-0 shadow-lg shadow-primary/20 transform sm:-rotate-3 group-hover:rotate-0 transition-transform duration-300">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge
                  variant="secondary"
                  className="font-mono text-xs py-1 px-3 flex items-center gap-1.5"
                >
                  <Hash className="h-3 w-3" /> রোল: {user.roll}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs py-1 px-3 flex items-center gap-1.5"
                >
                  <UserIcon className="h-3 w-3" /> শিক্ষার্থী
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Course & Order List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-3">
              <span className="h-8 w-1.5 bg-primary rounded-full hidden sm:block" />
              আমার কোর্সসমূহ
            </h2>
            <Badge variant="outline" className="sm:hidden">
              {user.orders.length} টি কোর্স
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {user.orders.length > 0 ? (
              user.orders.map((order) => {
                const enrolled = isEnrolled(order.courseId);

                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    {enrolled && (
                      <div className="absolute top-0 right-0 w-12 h-12 bg-primary/10 rounded-bl-3xl flex items-center justify-center pointer-events-none">
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-lg sm:text-xl text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {order.courseName}
                          </h3>
                          <p className="text-xs font-medium text-muted-foreground mt-2 flex items-center gap-2">
                            <span>{order.date}</span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="text-primary font-bold">
                              ৳{order.amount}
                            </span>
                            {order.status === "Approved" && (
                              <>
                                <span className="h-1 w-1 rounded-full bg-border" />
                                <span className={order.expiresAt ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                                  {order.expiresAt ? `মেয়াদ: ${new Date(order.expiresAt).toLocaleDateString("en-GB")}` : "লাইফটাইম"}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Approved"
                              ? "success"
                              : order.status === "Rejected"
                                ? "destructive"
                                : "warning"
                          }
                          className="uppercase tracking-widest text-[9px] px-2 py-0.5 shrink-0"
                        >
                          {order.status}
                        </Badge>
                      </div>

                      {order.status === "Pending" && (
                        <div className="p-3 bg-secondary/30 rounded-xl border border-border/50 text-xs text-secondary-foreground flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center shrink-0">
                            <Clock className="h-4 w-4 text-warning" />
                          </div>
                          <span>পেমেন্ট ভেরিফিকেশনের জন্য অপেক্ষা করুন...</span>
                        </div>
                      )}

                      {order.status === "Rejected" && (
                        <div className="p-3 bg-destructive/5 rounded-xl border border-destructive/20 text-xs text-destructive font-medium">
                          পেমেন্টটি গ্রহণ করা হয়নি। দয়া করে সাপোর্টে যোগাযোগ করুন।
                        </div>
                      )}

                      {order.adminComment && (
                        <div className="p-4 bg-primary/10 rounded-2xl border-l-4 border-primary text-xs text-foreground space-y-2 relative overflow-hidden shadow-sm ring-1 ring-primary/20">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-primary" />
                            <p className="font-black text-primary uppercase tracking-wider text-[11px]">
                              অ্যাডমিন নোট:
                            </p>
                          </div>
                          <div className="font-bold leading-relaxed whitespace-pre-line text-[14px] pl-0.5 text-foreground">
                            <Linkify text={order.adminComment} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      {enrolled ? (
                        <Button
                          fullWidth
                          size="lg"
                          className="gap-2 rounded-xl h-12 shadow-lg shadow-primary/10 hover:shadow-primary/20"
                          onClick={() => {
                            window.location.href = `https://examify.me/batches/${order.courseId}`;
                          }}
                        >
                          <Play className="h-4 w-4 fill-current" /> কোর্সটি দেখুন
                        </Button>
                      ) : (
                        <div className="h-12 w-full bg-muted/50 rounded-xl border border-dashed border-border flex items-center justify-center text-xs font-medium text-muted-foreground italic">
                          অ্যাপ্রুভ হওয়ার পর এখানে কোর্স দেখা যাবে
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 sm:py-24 border-2 border-dashed border-border rounded-3xl bg-muted/5">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted text-muted-foreground mb-6">
                  <FileText className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  কোনো কোর্স নেই
                </h3>
                <p className="text-muted-foreground font-medium mb-8 max-w-xs mx-auto text-sm sm:text-base px-4">
                  আপনার কোনো অর্ডার বা কোর্স নেই। আমাদের সেরা কোর্সগুলো দেখতে শপ ভিজিট
                  করুন।
                </p>
                <Link href="/#courses">
                  <Button size="lg" className="px-8 rounded-xl h-12">
                    কোর্স খুঁজুন
                  </Button>
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
