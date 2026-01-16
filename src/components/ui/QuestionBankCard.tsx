"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { QuestionBankItem } from "@/data/mockData";

interface QuestionBankCardProps {
  item: QuestionBankItem;
}

export default function QuestionBankCard({ item }: QuestionBankCardProps) {
  return (
    <Link
      href={`/question-bank/${item.id}`}
      className="group relative block h-full animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-card border border-border shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1 group-active:scale-[0.98]">
        <div className="h-full w-full relative group-hover:scale-105 transition-transform duration-500">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
            <BookOpen className="h-12 w-12" />
            <span className="mt-2 text-xs font-bold uppercase tracking-wider">
              Question Bank
            </span>
          </div>
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent opacity-80 transition-opacity group-hover:opacity-90"></div>

        {item.isLive && (
          <div className="absolute top-3 right-3">
            <Badge variant="live" className="gap-1.5 px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
              Live
            </Badge>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white text-xs sm:text-sm font-bold leading-tight line-clamp-2 drop-shadow-md group-hover:text-primary-foreground transition-colors">
            {item.title}
          </h3>
          <p className="text-white/70 text-[10px] mt-2 flex items-center gap-1 font-medium transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            Tap to practice <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </div>
    </Link>
  );
}
