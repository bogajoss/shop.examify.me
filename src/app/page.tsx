import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Examify - Admission & Academic Preparation",
  description:
    "Advanced learning platform for admission and academic preparation in Bangladesh. Expert guidance, live exams, and comprehensive study materials for your success.",
  openGraph: {
    title: "Examify - Admission & Academic Preparation",
    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Examify - Admission & Academic Preparation",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Examify - Admission & Academic Preparation",
    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",
    images: ["/api/og"],
  },
};

export default function Page() {
  return <HomeClient />;
}
