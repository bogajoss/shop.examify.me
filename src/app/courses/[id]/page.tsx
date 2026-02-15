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
  let description =
    batch.description || "Admission and Academic preparation platform.";

  // Ensure description is between 110-160 characters for SEO
  if (description.length < 110) {
    const suffix =
      " Enroll now on Examify for comprehensive admission and academic preparation with expert guidance and live exams.";
    description = (description + suffix).substring(0, 160);
  }

  // Use dynamic OG image
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set("title", batch.name);
  ogSearchParams.set("description", batch.description || "");
  const ogImage = `/api/og?${ogSearchParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: batch.name,
        },
      ],
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
    .select("*", { count: "exact", head: true })
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
