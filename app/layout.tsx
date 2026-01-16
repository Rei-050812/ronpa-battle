import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "上司論破バトル | ブラック上司を論破せよ！",
  description: "ブラック企業の理不尽な上司を3つのフレーズで論破するバイラルゲーム。格ゲー風の演出とClaude AIによる判定で、あなたの論破力を試そう！ #上司論破バトル",
  openGraph: {
    title: "上司論破バトル",
    description: "ブラック上司を論破せよ！",
    url: "https://ronpa-battle.zero-venture.com",
    siteName: "上司論破バトル",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "上司論破バトル",
    description: "ブラック上司を論破せよ！",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
