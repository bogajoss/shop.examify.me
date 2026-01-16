import { notFound } from "next/navigation";
import { type CQQuestion, db, type Question } from "@/data/mockData";
import QuestionBankClient from "./QuestionBankClient";

interface PageProps {
  params: Promise<{ id: string }>;
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
