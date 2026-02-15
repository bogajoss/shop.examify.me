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
  let description = `Practice ${item.title} questions on Examify. Prepare for your exams with our comprehensive question bank.`;

  if (description.length < 110) {
    description +=
      " Access thousands of curated questions with detailed solutions to boost your academic and admission preparation.";
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", item.title);
  ogSearchParams.set("description", item.category || "");
  const ogImage = `/api/og?${ogSearchParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
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
