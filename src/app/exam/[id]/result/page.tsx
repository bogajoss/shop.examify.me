"use client";

import { ArrowLeft, Check, Home, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import type { Question } from "@/data/mockData";

interface ExamResultData {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  examTitle: string;
  examId: string;
  answers: Record<number, number>;
  questions: Question[];
}

export default function ExamResult() {
  const [result, setResult] = useState<ExamResultData | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const stored = localStorage.getItem("lastExamResult");
    if (stored) {
      const parsed = JSON.parse(stored) as ExamResultData;
      // Optional: Verify if the result belongs to this exam ID
      if (parsed.examId === id) {
        setResult(parsed);
      } else {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [router, id]);

  if (!result) return null;

  const percentage = (result.score / result.total) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 mx-auto max-w-4xl px-4 py-8 w-full space-y-8">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-xl font-bold text-primary">এক্সাম রেজাল্ট</h1>
        </div>

        {/* Summary Card */}
        <div className="w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary/10 p-8 border-b border-border text-center">
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-background border-4 ${percentage >= 80 ? "border-primary" : "border-primary/50"} mb-4 shadow-inner`}
            >
              <span className="text-3xl font-bold text-foreground">
                {result.score}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                /{result.total}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {percentage >= 80
                ? "চমৎকার!"
                : percentage >= 50
                  ? "ভালো হয়েছে!"
                  : "আরও চেষ্টা করতে হবে!"}
            </h2>
            <p className="text-muted-foreground text-sm">
              You scored {Math.round(percentage)}% marks
            </p>
          </div>

          <div className="p-6 grid grid-cols-3 gap-4 text-center divide-x divide-border">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {result.correct}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Correct
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {result.wrong}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Wrong
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {result.total - (result.correct + result.wrong)}
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                Skipped
              </div>
            </div>
          </div>
        </div>

        {/* Solve Sheet */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground border-l-4 border-primary pl-3">
            Solve Sheet
          </h2>

          {result.questions.map((q: Question, idx: number) => {
            const selected = result.answers[q.id];
            const isCorrect = selected === q.ans;
            const isSkipped = selected === undefined;

            return (
              <div
                key={q.id}
                className={`border rounded-xl p-6 shadow-sm ${
                  isSkipped
                    ? "border-border bg-muted/20"
                    : isCorrect
                      ? "border-green-200 bg-green-50/50"
                      : "border-red-200 bg-red-50/50"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg flex-1 leading-relaxed">
                    <span className="text-muted-foreground mr-2">
                      {idx + 1}.
                    </span>{" "}
                    {q.q}
                  </h3>
                  <div className="ml-4 shrink-0">
                    {isCorrect ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      !isSkipped && <X className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {q.options.map((opt: string, optIdx: number) => {
                    let optionClass =
                      "flex items-center gap-3 p-3 rounded-lg border text-sm transition-all";
                    if (optIdx === q.ans) {
                      optionClass +=
                        " border-green-500 bg-green-100 text-green-900 font-bold";
                    } else if (optIdx === selected && !isCorrect) {
                      optionClass += " border-red-500 bg-red-100 text-red-900";
                    } else {
                      optionClass +=
                        " border-border bg-card text-muted-foreground";
                    }

                    return (
                      <div key={`${q.id}-${optIdx}`} className={optionClass}>
                        <div
                          className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${
                            optIdx === q.ans
                              ? "bg-green-600 border-green-600 text-white"
                              : "border-gray-400"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        {opt}
                      </div>
                    );
                  })}
                </div>

                {q.explain && (
                  <div className="mt-4 pt-4 border-t border-dashed border-border/50">
                    <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                      ব্যাখ্যা:
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {q.explain}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center py-8">
          <Button
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => router.push("/")}
          >
            <Home className="h-5 w-5" /> হোম-এ ফিরে যান
          </Button>
          <Button
            size="lg"
            className="gap-2"
            onClick={() => router.push("/#free-exams")}
          >
            অন্য এক্সাম দিন
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
