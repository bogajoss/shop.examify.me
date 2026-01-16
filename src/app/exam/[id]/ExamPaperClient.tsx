"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { FreeExam, Question } from "@/data/mockData";

interface ExamPaperClientProps {
  examInfo: FreeExam;
  questions: Question[];
  id: string;
}

export default function ExamPaperClient({
  examInfo,
  questions,
  id,
}: ExamPaperClientProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(`exam_progress_${id}`);
    if (saved) {
      const { savedAnswers, savedTimeLeft } = JSON.parse(saved);
      setAnswers(savedAnswers);
      setTimeLeft(savedTimeLeft);
      showToast("আপনার আগের অগ্রগতি লোড করা হয়েছে।");
    }
  }, [id, showToast]);

  // Auto-save progress
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(
        `exam_progress_${id}`,
        JSON.stringify({
          savedAnswers: answers,
          savedTimeLeft: timeLeft,
        }),
      );
    }, 5000); // Save every 5 seconds
    return () => clearInterval(interval);
  }, [id, answers, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

    // Haptic feedback for mobile
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      const q = questions.find((q) => q.id === questionId);
      if (isPracticeMode && q) {
        if (optionIndex === q.ans) {
          window.navigator.vibrate(50); // Success short vibration
        } else {
          window.navigator.vibrate([100, 50, 100]); // Error pattern
        }
      } else {
        window.navigator.vibrate(10); // Subtle tick
      }
    }
  };

  const handleSubmit = useCallback(() => {
    let score = 0;
    let correct = 0;
    let wrong = 0;

    for (const q of questions) {
      const selected = answers[q.id];
      if (selected !== undefined) {
        if (selected === q.ans) {
          score++;
          correct++;
        } else {
          score -= 0.25;
          wrong++;
        }
      }
    }

    const result = {
      score,
      correct,
      wrong,
      total: questions.length,
      examTitle: examInfo.title,
      examId: id,
      answers,
      questions: questions,
    };

    localStorage.setItem("lastExamResult", JSON.stringify(result));
    localStorage.removeItem(`exam_progress_${id}`); // Clear progress on submit
    router.push(`/exam/${id}/result`);
    showToast("এক্সাম সম্পন্ন হয়েছে!");
  }, [id, answers, examInfo.title, questions, router, showToast]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
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
                {examInfo.title}
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                {examInfo.subject} • {questions.length} Questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">
                Practice Mode
              </span>
              <button
                type="button"
                onClick={() => setIsPracticeMode(!isPracticeMode)}
                className={`w-8 h-4 rounded-full transition-colors relative ${isPracticeMode ? "bg-primary" : "bg-muted-foreground/30"}`}
              >
                <div
                  className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${isPracticeMode ? "left-4.5" : "left-0.5"}`}
                />
              </button>
            </div>

            <div className="text-right">
              <div
                className={`text-xl font-mono font-bold ${timeLeft < 60 ? "text-destructive animate-pulse" : "text-foreground"}`}
              >
                {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Time Left
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {questions.map((q: Question, idx: number) => (
              <button
                type="button"
                key={q.id}
                onClick={() =>
                  document
                    .getElementById(`q-${q.id}`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${
                  answers[q.id] !== undefined
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-4xl px-4 py-8 w-full space-y-6">
        {questions.map((q: Question, idx: number) => {
          const selected = answers[q.id];
          const isAnswered = selected !== undefined;

          return (
            <motion.div
              key={q.id}
              id={`q-${q.id}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm scroll-mt-32"
            >
              <h3 className="font-semibold text-lg mb-4 flex gap-3 text-foreground">
                <span className="bg-primary/10 text-primary w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold">
                  {idx + 1}
                </span>
                {q.q}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map((opt, optIdx) => {
                  let statusStyles = "border-border hover:bg-muted/50";

                  if (isAnswered) {
                    if (answers[q.id] === optIdx) {
                      statusStyles =
                        "border-primary bg-primary/5 ring-1 ring-primary";

                      if (isPracticeMode) {
                        statusStyles =
                          optIdx === q.ans
                            ? "border-green-500 bg-green-50 ring-1 ring-green-500"
                            : "border-red-500 bg-red-50 ring-1 ring-red-500";
                      }
                    } else if (isPracticeMode && optIdx === q.ans) {
                      statusStyles = "border-green-500 bg-green-50/30";
                    }
                  }

                  return (
                    <label
                      key={`${q.id}-${optIdx}`}
                      className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all active:scale-[0.99] ${statusStyles}`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        className="w-4 h-4 accent-primary"
                        checked={answers[q.id] === optIdx}
                        onChange={() => handleSelectAnswer(q.id, optIdx)}
                        disabled={isPracticeMode && isAnswered}
                      />
                      <span
                        className={`text-sm font-medium ${isPracticeMode && isAnswered && optIdx === q.ans ? "text-green-700" : ""}`}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {isPracticeMode && isAnswered && (
                <div className="mt-4 pt-4 border-t border-dashed border-border/50 animate-in slide-in-from-top-2">
                  <p className="text-xs font-bold text-primary mb-1">ব্যাখ্যা:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {q.explain || "কোনো ব্যাখ্যা দেওয়া হয়নি।"}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </main>

      <footer className="sticky bottom-0 bg-background border-t border-border p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="mx-auto max-w-4xl flex justify-between items-center">
          <div className="text-sm text-muted-foreground font-medium">
            {Object.keys(answers).length} of {questions.length} answered
          </div>
          <Button
            size="lg"
            onClick={() => {
              if (confirm("আপনি কি নিশ্চিত যে সাবমিট করতে চান?")) handleSubmit();
            }}
          >
            Submit Exam
          </Button>
        </div>
      </footer>
    </div>
  );
}
