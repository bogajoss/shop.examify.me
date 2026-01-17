"use client";

import { Check, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="rounded-lg bg-card text-card-foreground overflow-hidden border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="w-full aspect-video relative overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-lg">
          <div className="flex flex-col items-center">
            <ImageIcon className="h-12 w-12" />
            <span className="mt-2 text-sm">Course Preview</span>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="opacity-90 shadow-sm">
            {course.batch}
          </Badge>
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
            {(course.features && course.features.length > 0
              ? course.features
              : ["লাইভ ক্লাস", "লেকচার নোট", "স্ট্যান্ডার্ড এক্সাম", "সলভ শিট"]
            ).map((f: string) => (
              <div key={f} className="flex items-center gap-1 text-primary">
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
  );
}
