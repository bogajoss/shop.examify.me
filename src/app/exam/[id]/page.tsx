import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import ExamPaperClient from "./ExamPaperClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Try fetching from Supabase
  const { data: exam } = await supabase
    .from("exams")
    .select("name, course_name")
    .eq("id", id)
    .single();

  if (exam) {
    const title = `${exam.name} | Examify`;
    let description = `Take the ${exam.name} on Examify. Test your knowledge in ${exam.course_name || "General"}.`;

    if (description.length < 110) {
      description +=
        " Enhance your preparation with our advanced exam platform, featuring real-time results and detailed performance analysis.";
    }

    const ogSearchParams = new URLSearchParams();
    ogSearchParams.set("title", exam.name);
    ogSearchParams.set("description", exam.course_name || "");
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

  const examInfo = db.freeExams.find((e) => e.id === id);

  if (!examInfo) {
    return {
      title: "Exam Not Found | Examify",
    };
  }

  const title = `${examInfo.title} | Examify`;
  let description = `Take the ${examInfo.title} on Examify. Test your knowledge in ${examInfo.subject}.`;

  if (description.length < 110) {
    description +=
      " Prepare for your exams with our comprehensive collection of free model tests and academic resources.";
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", examInfo.title);
  ogSearchParams.set("description", examInfo.subject);
  const ogImage = `/api/og?${ogSearchParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ExamPage({ params }: Props) {
  const { id } = await params;

  // Try fetching from Supabase
  const { data: dbExam } = await supabase
    .from("exams")
    .select("*")
    .eq("id", id)
    .single();

  let examInfo = null;
  let questions = null;

  if (dbExam) {
    // Map Supabase exam to FreeExam interface
    examInfo = {
      id: dbExam.id,
      title: dbExam.name,
      subject: dbExam.course_name || "General",
      time: `${dbExam.duration_minutes} min`,
      questions: 0, // Will be updated with actual question count
      students: 0,
    };

    // Fallback questions since we don't have questions table
    // Using FE-001 questions as a placeholder
    questions = db.examQuestions["FE-001"];
    examInfo.questions = questions.length;
  } else {
    // Fallback to mock data
    examInfo = db.freeExams.find((e) => e.id === id);
    questions = db.examQuestions[id];
  }

  if (!examInfo || !questions) {
    notFound();
  }

  return <ExamPaperClient examInfo={examInfo} questions={questions} id={id} />;
}
