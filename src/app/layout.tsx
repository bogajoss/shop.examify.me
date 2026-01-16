import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "Examify - Medical Admission Preparation",
  description: "Advanced learning platform for medical admission preparation in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className={`${hindSiliguri.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}