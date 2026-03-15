import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitch-Print — Professional Pitch Flyer Generator",
  description: "Generate professional PDF pitch flyers with QR codes for local businesses. Anonymous developer lead generation tool.",
  keywords: ["Pitch-Print", "Lead Generation", "PDF Generator", "QR Code", "Developer Tools", "Business Flyers"],
  authors: [{ name: "Luit Lab" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Pitch-Print",
    description: "Professional Pitch Flyer Generator for Developers",
    url: "https://pitch-print.vercel.app",
    siteName: "Pitch-Print",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pitch-Print",
    description: "Professional Pitch Flyer Generator for Developers",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
