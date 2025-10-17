import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { url } from "inspector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://my-web-app--smooth-ripple-459804-d5.asia-east1.hosted.app/"
  ),
  title: "AgriTrace",
  description: "圃場の移動軌跡を監視する地図アプリです",
  openGraph: {
    title: "AgriTrace",
    description: "圃場の移動軌跡を監視する地図アプリです",
    images: "/public/AgriTrace_ogp.png",
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
