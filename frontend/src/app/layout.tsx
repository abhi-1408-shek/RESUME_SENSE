import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeSense 2.0 | AI Resume Parser & Analytics",
  description: "AI-Powered Resume Parser & Analytics Platform - Parse, analyze, and match resumes to job descriptions with intelligent skill extraction.",
  keywords: ["resume parser", "resume analyzer", "job matching", "skill extraction", "AI resume"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
