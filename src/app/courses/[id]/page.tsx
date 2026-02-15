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
    .select("name, description, icon_url")
    .eq("id", id)
    .single();

  if (!batch) {
    return { title: "Course Not Found" };
  }

  const title = `${batch.name} | Examify`;
  const description = batch.description || "Admission and Academic preparation platform.";
  const image = batch.icon_url || "/favicon.ico";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
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

  // Fetch approved student count
  const { count: studentCount } = await supabase
    .from("orders")
    .select("*", { count: 'exact', head: true })
    .eq("batch_id", id)
    .eq("status", "approved");

  const course = {
    id: batch.id,
    title: batch.name,
    category: batch.category || "General",
    price: batch.price || 0,
    oldPrice: batch.old_price || 0,
    students: studentCount || 0,
    status: batch.status === "live" ? "Published" : "Draft",
    batch: batch.name.split(" ")[0],
    description: batch.description || "",
    batchId: batch.id,
    features: batch.features || [],
    icon_url: batch.icon_url,
    routine_url: batch.routine_url,
    live_exams: batch.live_exams || "০+",
    lecture_notes: batch.lecture_notes || "০+",
    standard_exams: batch.standard_exams || "০+",
    solve_sheets: batch.solve_sheets || "০+",
    batch_stats: batch.batch_stats || [],
  };

  return <CourseDetailsClient course={course as any} />;
}
