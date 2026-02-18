import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type CQQuestion, db, type Question } from "@/data/mockData";
import QuestionBankClient from "./QuestionBankClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = db.questionBanks.find((i) => i.id === id);

  if (!item) {
    return { title: "Question Bank Not Found" };
  }

  const title = `${item.title} | Examify`;

  const description = `Practice ${item.title} questions on Examify. Prepare for your exams with our comprehensive question bank.`;

  return {
    title,

    description,

    openGraph: {
      title,

      description,

      images: ["https://examify.me/icon.png"],

      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title,

      description,

      images: ["https://examify.me/icon.png"],
    },
  };
}

export default async function QuestionBankPage({ params }: PageProps) {
  const { id } = await params;
  const item = db.questionBanks.find((i) => i.id === id);

  if (!item) {
    notFound();
  }

  let questions: Question[] | CQQuestion[] = [];
  if (item.type === "cq") {
    questions = db.cqQuestions[id] || [];
  } else {
    questions = db.qbQuestions;
  }

  return <QuestionBankClient item={item} questions={questions} />;
}
