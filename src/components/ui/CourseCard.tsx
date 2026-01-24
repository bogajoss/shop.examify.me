"use client";

import { BookOpen, FileText, Image as ImageIcon, ShieldCheck, Zap } from "lucide-react";
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
          <h3 className="text-xl font-black mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-3 text-[11px] font-bold pt-1">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{course.live_exams || "৯৯+"} লাইভ এক্সাম</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <BookOpen className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{course.lecture_notes || "১০০+"} লেকচার নোট</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{course.standard_exams || "৯৯+"} এক্সাম</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{course.solve_sheets || "১৯৯৯+"} সলভ শিট</span>
            </div>
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
          <div className="flex gap-2">
            <Link href={`/courses/${course.id}`}>
              <Button variant="outline" size="sm" className="rounded-xl font-bold">
                বিস্তারিত
              </Button>
            </Link>
            <Link href={`/checkout/${course.id}`}>
              <Button size="sm" className="rounded-xl font-bold px-5">ভর্তি হন</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
