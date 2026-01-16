"use client";

import { ChevronLeft, Lock } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import type { CQQuestion, Question, QuestionBankItem } from "@/data/mockData";

interface QuestionBankClientProps {
  item: QuestionBankItem;
  questions: (Question | CQQuestion)[];
}

export default function QuestionBankClient({
  item,
  questions,
}: QuestionBankClientProps) {
  const router = useRouter();

  const isCQ = item.type === "cq";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-[80px] sm:top-[88px] z-40">
          <div className="mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-bold text-primary line-clamp-1">
                  {item.title}
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {isCQ ? "Creative Questions (CQ)" : "Multiple Choice (MCQ)"} •{" "}
                  {questions.length} Items
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8 w-full space-y-6">
          {isCQ ? (
            <div className="space-y-8">
              {(questions as CQQuestion[]).map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm"
                >
                  <div className="mb-6">
                    <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-3">
                      উদ্দীপক {idx + 1} ({q.tag})
                    </span>
                    <div
                      className="text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: q.stem }}
                    />
                  </div>

                  <div className="space-y-4">
                    {q.questions.map((sub) => (
                      <div
                        key={sub.label}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <p className="font-bold text-primary mb-2">
                          {sub.label} . {sub.text}
                        </p>
                        <div className="pl-4 border-l-2 border-primary/20 text-sm text-muted-foreground">
                          {sub.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {(questions as Question[]).map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden group"
                >
                  {q.locked && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center flex-col p-6 text-center">
                      <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-bold text-foreground mb-1">
                        Locked Content
                      </h4>
                      <p className="text-xs text-muted-foreground max-w-[200px]">
                        Please enroll in a course to unlock this question bank.
                      </p>
                    </div>
                  )}

                  <h3 className="font-semibold text-lg mb-4 flex gap-3 text-foreground">
                    <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                      {idx + 1}
                    </span>
                    {q.q}
                  </h3>

                  {q.img && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border relative aspect-[3/1]">
                      <Image
                        src={q.img}
                        alt="Question visual"
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={`${q.id}-${optIdx}`}
                        className={`flex items-center gap-3 p-3 border rounded-xl bg-muted/10 border-border/50 ${
                          q.ans === optIdx && !q.locked
                            ? "bg-green-500/10 border-green-500/50"
                            : ""
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-bold shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {!q.locked && q.explain && (
                    <div className="mt-4 pt-4 border-t border-dashed border-border/50">
                      <p className="text-xs font-bold text-primary mb-1">
                        ব্যাখ্যা:
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {q.explain}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
