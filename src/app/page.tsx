"use client";

import {
  ArrowLeft,
  ArrowRight,
  BarChart,
  BookOpen,
  Check,
  Clock,
  FileText,
  Image as ImageIcon,
  Lightbulb,
  MessageCircle,
  Monitor,
  Play,
  Search,
  Smartphone,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { db } from "@/data/mockData";

export default function Home() {
  const [activeQbTab, setActiveQbTab] = useState("model-test");
  const [slideIndex, setSlideIndex] = useState(0);

  const qbTabs = [
    { id: "model-test", label: "মডেল টেস্ট" },
    { id: "subject-wise", label: "বিষয় ভিত্তিক" },
    { id: "institution", label: "প্রতিষ্ঠান ভিত্তিক" },
  ];

  const features = [
    {
      icon: <Monitor className="h-5 w-5" />,
      title: "অনলাইন প্রোগ্রাম",
      desc: "ঘরে বসেই সেরা প্রস্তুতি।",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "অভিজ্ঞ শিক্ষকবৃন্দ",
      desc: "সেরা মেন্টরদের সান্নিধ্যে।",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: "স্টাডি ম্যাটেরিয়ালস",
      desc: "মানসম্মত নোট এবং রিসোর্স।",
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: "কনসেপ্ট ভিত্তিক ক্লাস",
      desc: "বেসিক হোক শক্তিশালী।",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "ইউনিক এক্সাম সিস্টেম",
      desc: "নিজেকে যাচাইয়ের সেরা মাধ্যম।",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      title: "Q&A সাপোর্ট",
      desc: "তাৎক্ষণিক সমস্যার সমাধান।",
    },
    {
      icon: <Smartphone className="h-5 w-5" />,
      title: "সঠিক গাইডলাইন",
      desc: "সাফল্যের পথে এগিয়ে চলুন।",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "এক্সাম লিডারবোর্ড",
      desc: "অন্যদের সাথে নিজের অবস্থান যাচাই।",
    },
  ];

  const nextSlide = () => setSlideIndex((prev) => (prev + 1) % 5);
  const prevSlide = () => setSlideIndex((prev) => (prev - 1 + 5) % 5);

  const filteredQbItems = db.questionBanks.filter(
    (item) => item.category === activeQbTab,
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-secondary/30 py-10 md:py-24 lg:py-32 px-4 border-b border-border relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary blur-[100px]"></div>
            <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary blur-[100px]"></div>
          </div>
          <div className="mx-auto max-w-5xl text-center space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs sm:text-sm font-medium text-primary mb-4 animate-in fade-in zoom-in duration-500">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              মেডিকেল ভর্তি প্রস্তুতি ২০২৬
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              স্বপ্ন যখন{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary-foreground">
                ডাক্তার
              </span>{" "}
              হওয়ার
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Examify-এর সাথে আপনার মেডিকেল ভর্তি প্রস্তুতির যাত্রা শুরু হোক। শপ থেকে টোকেন
              সংগ্রহ করুন এবং নিজের সুবিধামতো এনরোল করুন।
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 px-4 w-full sm:w-auto">
              <Link href="/#courses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full shadow-lg shadow-primary/20 hover:scale-105"
                >
                  কোর্সসমূহ দেখুন
                </Button>
              </Link>
              <Link href="/#free-exams" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full">
                  ফ্রি এক্সাম দিন
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 pt-8 border-t border-border/50 max-w-4xl mx-auto px-4">
              {[
                { label: "শিক্ষার্থী", value: "৫,০০০+" },
                { label: "মেন্টর", value: "২০+" },
                { label: "লেকচার", value: "৫০০+" },
                { label: "সফলতার হার", value: "৯৮%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-lg bg-card/50 hover:border-primary/10 transition-all border border-transparent"
                >
                  <span className="text-2xl sm:text-3xl font-bold text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-7xl flex-col gap-12 sm:gap-16 px-4 pb-16 pt-10 sm:pt-14 w-full">
          {/* Courses Section */}
          <section id="courses" className="space-y-6 w-full scroll-mt-24">
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    চলমান কোর্সসমূহ
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    আপনার সফলতার জন্য বিশেষভাবে ডিজাইন করা প্রিমিয়াম প্রোগ্রাম।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {db.courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg bg-card text-card-foreground overflow-hidden border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col h-full group"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-lg">
                        <div className="flex flex-col items-center">
                          <ImageIcon className="h-12 w-12" />
                          <span className="mt-2 text-sm">Course Preview</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                        <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary/90 text-white shadow-sm">
                          {course.batch}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-muted-foreground text-xs mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {[
                            "লাইভ ক্লাস",
                            "লেকচার নোট",
                            "স্ট্যান্ডার্ড এক্সাম",
                            "সলভ শিট",
                          ].map((f) => (
                            <div
                              key={f}
                              className="flex items-center gap-1 text-primary"
                            >
                              <Check className="h-3 w-3" />{" "}
                              <span className="text-muted-foreground">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-dashed border-border">
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-destructive line-through font-medium">
                            ৳{course.oldPrice}
                          </span>
                          <div className="text-base font-bold text-primary">
                            ৳{course.price}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              বিস্তারিত
                            </Button>
                          </Link>
                          <Link href={`/checkout/${course.id}`}>
                            <Button size="sm">ভর্তি হন</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Free Exams Section */}
          <section id="free-exams" className="space-y-6 w-full scroll-mt-24">
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    ফ্রি এক্সামসমূহ
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    নিজেদের যাচাই করুন সম্পূর্ণ বিনামূল্যে।
                  </p>
                </div>
                <button
                  type="button"
                  className="text-primary text-sm font-medium hover:underline"
                >
                  সব দেখুন →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {db.freeExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="rounded-lg bg-card text-card-foreground overflow-hidden border border-border shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all flex flex-col h-full group"
                  >
                    <div className="w-full aspect-video relative overflow-hidden bg-muted flex items-center justify-center text-muted-foreground/30">
                      <div className="flex flex-col items-center">
                        <FileText className="h-10 w-10" />
                        <span className="mt-2 text-sm font-medium">
                          Exam Preview
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
                          Free
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium bg-foreground/80 text-background backdrop-blur-md">
                          {exam.subject}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                          {exam.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {exam.students}{" "}
                            students
                          </span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="text-primary font-medium flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>{" "}
                            Live Now
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-primary" />{" "}
                            {exam.time}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3 text-primary" />{" "}
                            {exam.questions} Ques.
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3 w-3 text-primary" />{" "}
                            {exam.questions} Marks
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-destructive font-bold">
                              -
                            </span>{" "}
                            0.25 Neg.
                          </div>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-dashed border-border flex gap-2">
                        <Link href={`/exam/${exam.id}`} className="flex-1">
                          <Button fullWidth variant="primary" className="gap-2">
                            <Play className="h-4 w-4 fill-current" /> এখন শুরু করুন
                          </Button>
                        </Link>
                        <Link
                          href={`/exam/${exam.id}/leaderboard`}
                          className="flex-1"
                        >
                          <Button fullWidth variant="outline" className="gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />{" "}
                            লিডারবোর্ড
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Question Bank Section */}
          <section
            id="question-bank"
            className="space-y-6 w-full pt-4 scroll-mt-24"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                    প্রশ্নব্যাংক
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    বিগত বছরের প্রশ্ন ও মডেল টেস্ট অনুশীলন করুন।
                  </p>
                </div>
              </div>

              <div className="bg-muted/10 border border-border/50 rounded-xl p-4 w-full sticky top-[70px] md:top-20 z-30 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {qbTabs.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveQbTab(tab.id)}
                        className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 
                        ${
                          activeQbTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-background text-muted-foreground hover:bg-muted border border-border"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="relative w-full md:w-64">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="প্রশ্ন খুঁজুন..."
                      className="w-full h-9 pl-9 pr-4 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                    />
                  </div>
                </div>
              </div>

              <div className="min-h-[40vh]">
                {filteredQbItems.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredQbItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/question-bank/${item.id}`}
                        className="group relative block h-full"
                      >
                        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]">
                          <div className="h-full w-full relative group-hover:scale-105 transition-transform duration-500">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover opacity-60"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                              <BookOpen className="h-12 w-12" />
                              <span className="mt-2 text-xs font-bold uppercase tracking-wider">
                                Question Bank
                              </span>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80"></div>
                          {item.isLive && (
                            <div className="absolute top-2 right-2">
                              <span className="flex items-center gap-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-sm backdrop-blur-md bg-opacity-90">
                                <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>{" "}
                                Live
                              </span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-background text-xs sm:text-sm font-bold leading-tight line-clamp-3 drop-shadow-md group-hover:text-primary-foreground transition-colors">
                              {item.title}
                            </h3>
                            <p className="text-background/70 text-[10px] mt-1 flex items-center gap-1">
                              Tap to practice <ArrowRight className="h-3 w-3" />
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground mb-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      এই ক্যাটাগরিতে কোনো প্রশ্ন পাওয়া যায়নি।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold tracking-tight">
                আমাদের বিশেষত্ব
              </h2>
              <p className="text-sm text-muted-foreground">
                কেন বাছবেন Examify?
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {features.map((f, _i) => (
                <div
                  key={f.title}
                  className="rounded-lg bg-card text-card-foreground shadow-sm border-2 border-primary/10 hover:border-primary/30 transition-colors group"
                >
                  <div className="flex flex-col items-center text-center p-4 gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section id="reviews" className="space-y-8 w-full overflow-hidden">
            <h2 className="text-2xl font-semibold tracking-tight text-center">
              শিক্ষার্থীদের মতামত
            </h2>
            <div className="relative md:px-12">
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${slideIndex * 100}%)` }}
                >
                  {[1, 2, 3, 4, 5].map((num, i) => (
                    <div
                      key={num}
                      className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] px-4"
                    >
                      <div className="border border-none text-card-foreground h-full shadow-md bg-card rounded-xl overflow-hidden ring-1 ring-border">
                        <div className="p-6 flex flex-col gap-4 h-full bg-gradient-to-br from-card to-secondary/30">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Users className="h-7 w-7" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-base truncate text-primary">
                                Student {i + 1}
                              </h3>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
                                College Name
                              </p>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
                            "Examify-এর মাধ্যমে টোকেন কিনে এনরোল করা খুব সহজ। তাদের
                            সার্ভিস অসাধারণ!"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[3px] border-input bg-background hidden md:flex items-center justify-center text-primary shadow-sm hover:bg-accent -ml-4 lg:-ml-12"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border-[3px] border-input bg-background hidden md:flex items-center justify-center text-primary shadow-sm hover:bg-accent -mr-4 lg:-mr-12"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === slideIndex ? "bg-primary w-6" : "bg-primary/20 w-2 hover:bg-primary/40"}`}
                ></button>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/8801999681290"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 sm:right-8 z-40 h-14 w-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer text-white active:scale-95 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>WhatsApp Support</title>
          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
        <span className="absolute right-16 bg-black/80 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          WhatsApp Support
        </span>
      </a>

      <Footer />
    </div>
  );
}
