"use client";

import { Check, Clock, FileText, Play, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { FreeExam } from "@/data/mockData";

interface ExamCardProps {
  exam: FreeExam;
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <div className="rounded-lg bg-card text-card-foreground overflow-hidden border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group">
      <div className="w-full aspect-video relative overflow-hidden bg-muted flex items-center justify-center text-muted-foreground/30">
        <div className="flex flex-col items-center">
          <FileText className="h-10 w-10" />
          <span className="mt-2 text-sm font-medium">Exam Preview</span>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="success" className="shadow-sm">
            Free
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge
            variant="outline"
            className="bg-foreground/80 text-background border-none backdrop-blur-md text-[10px]"
          >
            {exam.subject}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {exam.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {exam.students} students
            </span>
            <span className="text-muted-foreground/30">•</span>
            <Badge variant="live" className="gap-1 px-2 py-0">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              Live Now
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/50">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" /> {exam.time}
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3 text-primary" /> {exam.questions}{" "}
              Ques.
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-primary" /> {exam.questions} Marks
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-destructive font-bold">-</span> 0.25 Neg.
            </div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-dashed border-border flex gap-2">
          <Link href={`/exam/${exam.id}`} className="flex-1">
            <Button fullWidth variant="primary" className="gap-2">
              <Play className="h-4 w-4 fill-current" /> এখন শুরু করুন
            </Button>
          </Link>
          <Link href={`/exam/${exam.id}/leaderboard`} className="flex-1">
            <Button fullWidth variant="outline" className="gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" /> লিডারবোর্ড
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
