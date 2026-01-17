import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";

const hindSiliguri = localFont({
  src: [
    {
      path: "../../public/fonts/HindSiliguri-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/HindSiliguri-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Examify - Medical Admission Preparation",
  description:
    "Advanced learning platform for medical admission preparation in Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${hindSiliguri.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <AdminProvider>
            <ToastProvider>{children}</ToastProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
