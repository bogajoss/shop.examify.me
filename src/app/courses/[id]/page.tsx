import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CourseDetailsClient from "./CourseDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const { data: batch } = await supabase
    .from("batches")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!batch) {
    return { title: "Course Not Found" };
  }

  return {
    title: `${batch.name} | Examify`,
    description: batch.description,
  };
}

export default async function CoursePage({ params }: Props) {
  const { id } = await params;

  const { data: batch, error } = await supabase
    .from("batches")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !batch) {
    notFound();
  }

  const course = {
    id: batch.id,
    title: batch.name,
    category: batch.category || "General",
    price: batch.price || 0,
    oldPrice: batch.old_price || 0,
    students: 0,
    status: batch.status === "live" ? "Published" : "Draft",
    batch: batch.name.split(" ")[0],
    description: batch.description || "",
    batchId: batch.id,
    features: batch.features || [],
    icon_url: batch.icon_url,
    live_exams: batch.live_exams || "০+",
    lecture_notes: batch.lecture_notes || "০+",
    standard_exams: batch.standard_exams || "০+",
    solve_sheets: batch.solve_sheets || "০+",
    batch_stats: batch.batch_stats || [],
  };

  return <CourseDetailsClient course={course as any} />;
}
