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

  title: {

    default: "Examify - Admission & Academic Preparation",

    template: "%s | Examify",

  },

  description:

    "Advanced learning platform for admission and academic preparation in Bangladesh. Expert guidance, live exams, and comprehensive study materials for your success.",

  keywords: ["Admission", "Academic", "HSC", "SSC", "Exam", "Preparation", "Bangladesh"],

  authors: [{ name: "Examify Team" }],

  creator: "Examify",

  publisher: "Examify",

  formatDetection: {

    email: false,

    address: false,

    telephone: false,

  },

  openGraph: {

    title: "Examify - Admission & Academic Preparation",

    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",

    url: "https://shop.examify.me",

    siteName: "Examify",

    images: [

      {

        url: "/api/og",

        width: 1200,

        height: 630,

        alt: "Examify",

      },

    ],

    locale: "bn_BD",

    type: "website",

  },

  twitter: {

    card: "summary_large_image",

    title: "Examify - Admission & Academic Preparation",

    description: "Advanced learning platform for admission and academic preparation in Bangladesh.",

    images: ["/api/og"],

    creator: "@examify",

  },

  robots: {

    index: true,

    follow: true,

    googleBot: {

      index: true,

      follow: true,

      "max-video-preview": -1,

      "max-image-preview": "large",

      "max-snippet": -1,

    },

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
