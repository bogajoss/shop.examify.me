
import { db } from "@/data/mockData";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Clock, FileQuestion, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ClassroomPage({ params }: Props) {
  const { id } = await params;
  const course = db.courses.find((c) => c.id === id);

  if (!course) {
    notFound();
  }

  // Fetch exams for this batch
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*")
    .eq("batch_id", course.batchId)
    .order("start_at", { ascending: false });

  if (error) {
    console.error("Error fetching exams:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 w-full">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {course.title} - Classroom
          </h1>
          <p className="text-muted-foreground">{course.batch}</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold border-l-4 border-primary pl-3">
              Exams
            </h2>
          </div>

          <div className="grid gap-4">
            {exams && exams.length > 0 ? (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                    <div>
                      <h3 className="font-bold text-lg text-primary">
                        {exam.name}
                      </h3>
                      {exam.description && (
                         <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                           {exam.description}
                         </p>
                      )}
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {exam.duration_minutes} mins
                        </div>
                        <div className="flex items-center gap-1">
                            <FileQuestion className="h-3.5 w-3.5" />
                            {exam.marks_per_question * 100} Marks (Approx)
                        </div>
                        {exam.start_at && (
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(exam.start_at).toLocaleString()}
                            </div>
                        )}
                      </div>
                    </div>

                    <Link href={`/exam/${exam.id}`}>
                      <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                        Start Exam
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-border rounded-xl bg-muted/20">
                <p className="text-muted-foreground">No exams available for this batch yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
