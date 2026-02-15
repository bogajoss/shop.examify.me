"use client";

import {
  ArrowRight,
  BookOpen,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="rounded-2xl bg-card text-card-foreground overflow-hidden border border-border shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 flex flex-col h-full group">
      <div className="w-full aspect-[16/10] relative overflow-hidden bg-muted">
        {course.icon_url ? (
          <Image
            src={course.icon_url}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-lg">
            <div className="flex flex-col items-center">
              <ImageIcon className="h-12 w-12" />
              <span className="mt-2 text-sm">Course Preview</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-background/80 backdrop-blur-md text-foreground font-bold px-3 py-1 border-none shadow-lg">
            {course.batch}
          </Badge>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between gap-5">
        <div>
          <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          <div className="flex flex-col gap-3 text-[11px] font-bold pt-1">
            {(course.batch_stats && course.batch_stats.length > 0
              ? course.batch_stats
              : [
                  { label: "লাইভ এক্সাম", value: course.live_exams || "৯৯+" },
                  { label: "লেকচার নোট", value: course.lecture_notes || "১০০+" },
                  { label: "এক্সাম", value: course.standard_exams || "৯৯+" },
                  { label: "সলভ শিট", value: course.solve_sheets || "১৯৯৯+" },
                ]
            ).map((item, idx) => {
              const colors = [
                "text-primary",
                "text-emerald-500",
                "text-amber-500",
                "text-rose-500",
                "text-indigo-500",
              ];
              const color = colors[idx % colors.length];

              return (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-muted-foreground group-hover:text-foreground transition-colors"
                >
                  <ArrowRight className={`h-3.5 w-3.5 ${color} shrink-0`} />
                  <span className="whitespace-pre-line leading-relaxed">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto pt-5 border-t border-border/50">
          <div className="flex flex-col items-start">
            <span className="text-[11px] text-destructive line-through font-bold opacity-60">
              ৳{course.oldPrice}
            </span>
            <div className="text-2xl font-black text-primary">
              ৳{course.price}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {course.routine_url && (
              <a
                href={course.routine_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mb-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-bold border-primary/30 text-primary hover:bg-primary/5 flex items-center justify-center gap-2 py-5"
                >
                  <FileText className="h-4 w-4" />
                  রুটিন দেখুন
                </Button>
              </a>
            )}
            <div className="flex gap-2 w-full">
              <Link href={`/courses/${course.id}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl font-bold"
                >
                  বিস্তারিত
                </Button>
              </Link>
              <Link href={`/checkout/${course.id}`} className="flex-1">
                <Button size="sm" className="w-full rounded-xl font-bold">
                  ভর্তি হন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
