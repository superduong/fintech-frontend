import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BuyNgon Clone — Mua hộ quốc tế (demo)",
  description: "Ứng dụng demo: tạo đơn báo giá, mua hàng Mỹ & Tây Ban Nha về Việt Nam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bn-bg)]">
        <Header />
        {children}
        <footer className="mt-auto border-t border-[var(--bn-border)] px-4 py-8 text-center text-xs text-[var(--bn-muted)]">
          Demo học tập — không liên kết với BuyNgon. API: FastAPI · UI: Next.js
        </footer>
      </body>
    </html>
  );
}
