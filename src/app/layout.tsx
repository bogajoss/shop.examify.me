import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AdminProvider } from "@/context/AdminContext";
import { AuthProvider } from "@/context/AuthContext";

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

  metadataBase: new URL("https://shop.examify.me"),

  title: "Examify - Admission & Academic Preparation",

  description:

    "Advanced learning platform for admission and academic preparation in Bangladesh.",

  openGraph: {

    title: "Examify - Admission & Academic Preparation",

    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",

    images: ["https://examify.me/icon.png"],

    type: "website",

  },

  twitter: {

    card: "summary_large_image",

    title: "Examify - Admission & Academic Preparation",

    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",

    images: ["https://examify.me/icon.png"],

  },

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
            <ToastProvider>
              {children}
              <WhatsAppButton />
            </ToastProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
