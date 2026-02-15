import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Examify - Admission & Academic Preparation",
  description: "Advanced learning platform for admission and academic preparation in Bangladesh.",
  openGraph: {
    images: ["https://examify.me/icon.png"],
  },
  twitter: {
    images: ["https://examify.me/icon.png"],
  },
};

export default function Page() {
  return <HomeClient />;
}
