import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Naufal Fathi | Fullstack Developer Portfolio",
  description:
    "Welcome to Naufal Fathi's portfolio — a passionate fullstack developer specializing in web, mobile, and modern digital experiences.",
  keywords: [
    "Naufal Fathi",
    "Fullstack Developer",
    "Web Developer",
    "Mobile Developer",
    "Portfolio",
    "Next.js",
    "React",
    "Laravel",
  ],
  authors: [{ name: "Naufal Fathi", url: "https://yvezh.my.id/" }],
  creator: "Naufal Fathi",
  publisher: "Naufal Fathi",
  metadataBase: new URL("https://yvezh.my.id/"), // ganti dengan domain asli kamu
  openGraph: {
    title: "Naufal Fathi | Fullstack Developer Portfolio",
    description:
      "Explore Naufal Fathi’s work in web and mobile development — creative, efficient, and modern solutions for your digital needs.",
    url: "https://yvezh.my.id/",
    siteName: "Naufal Fathi Portfolio",
    images: [
      {
        url: "/favicon.ico", // taruh di public/
        width: 1200,
        height: 630,
        alt: "Naufal Fathi Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico", // taruh di public/
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naufal Fathi | Fullstack Developer",
    description:
      "Check out Naufal Fathi’s fullstack projects — web, mobile, and creative digital works.",
    images: ["/favicon.ico"],
    creator: "@yvezhvillette", // opsional
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights /> {/* Analisis performa */}
        <Analytics /> {/* Analisis traffic */}
      </body>
    </html>
  );
}
