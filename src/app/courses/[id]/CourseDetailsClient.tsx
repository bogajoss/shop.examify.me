"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  ImageIcon,
  PlayCircle,
  Share2,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Course } from "@/data/mockData";

interface CourseDetailsClientProps {
  course: Course;
}

export default function CourseDetailsClient({
  course,
}: CourseDetailsClientProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 pb-24 lg:pb-16">
        {/* Hero Section with Image */}
        <div className="relative w-full h-[30vh] sm:h-[45vh] lg:h-[50vh] bg-muted overflow-hidden">
          {course.icon_url ? (
            <Image
              src={course.icon_url}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30 bg-secondary/20">
              <ImageIcon className="h-20 w-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

          <div className="absolute top-6 left-4 sm:left-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-background/80 backdrop-blur-md text-foreground p-2 sm:px-4 sm:py-2 rounded-xl shadow-lg hover:bg-background transition-all flex items-center gap-2 text-sm font-bold"
            >
              <ArrowLeft className="h-4 w-4" />{" "}
              <span className="hidden sm:inline">ফিরে যান</span>
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 -mt-16 sm:-mt-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary/5 space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary text-white font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wider">
                      {course.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="font-bold px-3 py-1 rounded-lg text-xs"
                    >
                      {course.batch}
                    </Badge>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                    {course.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground font-medium pt-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{course.students > 0 ? course.students : 450}+ শিক্ষার্থী</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span>৪.৯ রেটিং</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                      <span>শেয়ার করুন</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/50">
                  <h3 className="font-black text-xl mb-4 text-primary flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> কোর্সের বিবরণ
                  </h3>
                  <div className="text-muted-foreground leading-relaxed text-base sm:text-lg space-y-4">
                    <p>{course.description}</p>

                    <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10 mt-6 italic">
                      "এই কোর্সটি এমনভাবে ডিজাইন করা হয়েছে যাতে একজন শিক্ষার্থী একদম শুরু
                      থেকে একাডেমিক এবং বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি নিতে পারে। আমাদের স্পেশাল মেন্টরশিপ
                      প্রোগ্রাম আপনাকে সাফল্যের পথে এগিয়ে রাখবে।"
                    </div>
                  </div>
                </div>

                {/* Video Tutorial Section */}
                <div id="enroll-guide" className="pt-8 border-t border-border/50">
                  <h3 className="font-black text-xl mb-6 text-primary flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-primary" /> কিভাবে এনরোল করবেন? (ভিডিও গাইড)
                  </h3>
                  <div className="relative aspect-video w-full overflow-hidden rounded-3xl border-4 border-muted shadow-2xl bg-muted">
                    <iframe
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                      title="How to enroll in Examify"
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground text-center font-medium">
                    উপরে দেখানো ভিডিওটি ফলো করে আপনি খুব সহজেই কোর্সে এনরোল করতে পারবেন।
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="font-black text-xl text-primary flex items-center gap-2">
                    <Check className="h-5 w-5" /> কোর্সের বিশেষত্ব
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {(course.batch_stats && course.batch_stats.length > 0
                      ? course.batch_stats
                      : (course.features && course.features.length > 0
                          ? course.features.map(f => ({ label: f, value: "" }))
                          : [
                              "লাইভ এক্সাম ও সলভ সেশন",
                              "পিডিএফ সলভ শিট",
                              "অধ্যায়ভিত্তিক ও পূর্ণাঙ্গ মডেল টেস্ট",
                              "২৪/৭ সলভ গ্রুপ সাপোর্ট",
                            ].map(f => ({ label: f, value: "" }))
                        )
                    ).map((item, idx) => {
                      const label = typeof item === 'string' ? item : item.label;
                      const value = typeof item === 'string' ? "" : item.value;
                      
                      const iconConfigs = [
                        { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                        { icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                        { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                        { icon: FileText, color: "text-rose-500", bg: "bg-rose-500/10" },
                        { icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-500/10" },
                        { icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
                        { icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
                      ];
                      const config = iconConfigs[idx % iconConfigs.length];
                      const Icon = config.icon;

                      return (
                        <details key={idx} className="group bg-muted/30 border border-border rounded-2xl overflow-hidden transition-all duration-300 open:bg-card open:border-primary/20 shadow-sm hover:shadow-md">
                          <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${config.bg} ${config.color} transition-all duration-300 group-open:scale-110`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                                {label}
                              </span>
                            </div>
                            <div className="text-muted-foreground group-open:rotate-180 transition-transform duration-300">
                              <ArrowRight className="h-4 w-4 rotate-90 group-open:rotate-0" />
                            </div>
                          </summary>
                          {value && (
                            <div className="px-6 pb-5 ml-12 animate-in slide-in-from-top-2 duration-300">
                              <p className="text-xs font-medium text-muted-foreground leading-relaxed whitespace-pre-line border-l-2 border-primary/20 pl-5 py-1">
                                {value}
                              </p>
                            </div>
                          )}
                        </details>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-transform">
                <div className="bg-primary p-6 text-white text-center space-y-1">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                    Enrolling in
                  </p>
                  <h3 className="font-black text-xl truncate px-2">
                    {course.title}
                  </h3>
                </div>
                <div className="p-8 space-y-8">
                  <div className="text-center space-y-1">
                    <p className="text-sm text-destructive line-through font-black opacity-60">
                      ৳{course.oldPrice}
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-5xl font-black text-primary">
                        ৳{course.price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                      <div className="bg-white/20 p-2 rounded-xl">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest opacity-80 font-bold">এক্সেস ভ্যালিডিটি</span>
                        <span className="text-sm font-black">পরীক্ষা শেষ হওয়া পর্যন্ত</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {course.routine_url && (
                        <a 
                          href={course.routine_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full"
                        >
                          <Button
                            fullWidth
                            variant="outline"
                            size="lg"
                            className="h-12 rounded-2xl text-base font-bold border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FileText className="h-5 w-5" /> রুটিন দেখুন
                          </Button>
                        </a>
                      )}
                      
                      <Button
                        fullWidth
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-2xl text-base font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        onClick={() => document.getElementById('enroll-guide')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        <PlayCircle className="h-5 w-5" /> কিভাবে ভর্তি হবেন?
                      </Button>
                      
                      <Button
                        fullWidth
                        size="lg"
                        className="h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        onClick={() => router.push(`/checkout/${course.id}`)}
                      >
                        ভর্তি হন (Enroll Now)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border z-50 lg:hidden flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] pb-8 sm:pb-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="flex flex-col">
            <span className="text-xs text-destructive line-through font-bold opacity-60">
              ৳{course.oldPrice}
            </span>
            <span className="text-3xl font-black text-primary">
              ৳{course.price}
            </span>
          </div>
          <Button
            className="flex-1 h-14 rounded-2xl text-lg font-black shadow-lg shadow-primary/20"
            size="lg"
            onClick={() => router.push(`/checkout/${course.id}`)}
          >
            ভর্তি হন
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
