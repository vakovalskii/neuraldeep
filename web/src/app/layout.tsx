import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "skillsbd — каталог навыков для AI-агентов";
const description =
  "Открытый каталог переиспользуемых навыков для Claude Code, Cursor, Copilot и других AI-агентов. Находите, устанавливайте и делитесь навыками.";
const url = "https://skillsbd.ru";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: "%s | skillsbd",
  },
  description,
  keywords: [
    "AI навыки",
    "AI агенты",
    "Claude Code",
    "Cursor",
    "Copilot",
    "Windsurf",
    "Cline",
    "навыки для агентов",
    "skills",
    "каталог навыков",
    "skillsbd",
  ],
  authors: [{ name: "skillsbd" }],
  creator: "skillsbd",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url,
    siteName: "skillsbd",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
