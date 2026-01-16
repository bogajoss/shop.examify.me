import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/data/mockData";
import ExamPaperClient from "./ExamPaperClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const examInfo = db.freeExams.find((e) => e.id === id);

  if (!examInfo) {
    return {
      title: "Exam Not Found | Examify",
    };
  }

  return {
    title: `${examInfo.title} | Examify`,
    description: `Take the ${examInfo.title} on Examify. Test your knowledge in ${examInfo.subject}.`,
    openGraph: {
      title: examInfo.title,
      description: `Take the ${examInfo.title} on Examify.`,
      images: [
        `https://placehold.co/1200x630?text=${encodeURIComponent(examInfo.title)}`,
      ],
    },
  };
}

export default async function ExamPage({ params }: Props) {
  const { id } = await params;
  const examInfo = db.freeExams.find((e) => e.id === id);
  const questions = db.examQuestions[id];

  if (!examInfo || !questions) {
    notFound();
  }

  return <ExamPaperClient examInfo={examInfo} questions={questions} id={id} />;
}
