"use client";

import { ArrowLeft, Check, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-background text-foreground pb-24 md:pb-16 w-full">
        <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-sm text-muted-foreground hover:text-primary mb-4 flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>

              <div className="w-full rounded-xl overflow-hidden border border-border bg-muted shadow-sm relative aspect-video group flex items-center justify-center">
                {course.icon_url ? (
                  <img 
                    src={course.icon_url} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground/40">
                    <ImageIcon className="h-16 w-16" />
                    <span className="mt-2 text-lg font-bold">
                      Course Cover Image
                    </span>
                  </div>
                )}
              </div>

              <div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-primary">
                  {course.title}
                </h1>
                <p className="text-muted-foreground mt-2 text-sm md:text-base leading-relaxed">
                  {course.batch} – মেডিকেল ভর্তি পরীক্ষা প্রস্তুতি
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6 border-b border-border/50">
                <h3 className="font-semibold tracking-tight text-xl text-primary">
                  Course Description
                </h3>
              </div>
              <div className="p-6 text-sm md:text-base space-y-4 text-muted-foreground leading-relaxed">
                <p>{course.description}</p>
                <blockquote className="border-l-4 border-destructive pl-4 my-4 italic text-foreground bg-destructive/5 p-4 rounded-r">
                  <p>
                    ✅ <strong>বিশেষ অফার:</strong> কোর্স ফি মাত্র{" "}
                    <strong className="text-primary">৳{course.price}</strong>{" "}
                    (মূল ফি ৳{course.oldPrice} থেকে{" "}
                    <strong className="text-destructive">ছাড়!</strong>)
                  </p>
                </blockquote>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {(course.features && course.features.length > 0
                    ? course.features
                    : [
                        "লাইভ এক্সাম ও সলভ সেশন",
                        "পিডিএফ সলভ শিট",
                        "অধ্যায়ভিত্তিক ও পূর্ণাঙ্গ মডেল টেস্ট",
                        "২৪/৭ সলভ গ্রুপ সাপোর্ট",
                      ]
                  ).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/20"
                    >
                      <div className="bg-primary text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-lg border border-primary/20 bg-card text-card-foreground shadow-lg shadow-primary/5 overflow-hidden">
                <div className="bg-primary/5 p-4 border-b border-primary/10 text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    Enrolling in
                  </p>
                  <h3 className="font-bold text-primary line-clamp-1">
                    {course.title}
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-destructive line-through font-medium">
                      ৳{course.oldPrice}
                    </p>
                    <div className="text-4xl font-extrabold text-primary">
                      ৳{course.price}
                    </div>
                  </div>
                  <Button
                    fullWidth
                    size="lg"
                    onClick={() => router.push(`/checkout/${course.id}`)}
                  >
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-lg border-t border-border z-50 lg:hidden flex items-center justify-between gap-4 shadow-[0_-5px_10px_rgba(0,0,0,0.05)] pb-6 sm:pb-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-destructive line-through font-medium">
              ৳{course.oldPrice}
            </span>
            <span className="text-2xl font-bold text-primary">
              ৳{course.price}
            </span>
          </div>
          <Button
            className="flex-1"
            size="lg"
            onClick={() => router.push(`/checkout/${course.id}`)}
          >
            Enroll Now
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
