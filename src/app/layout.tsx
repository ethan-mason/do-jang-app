import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoJang",
  description: "Your ultimate task master!",
  openGraph: {
    title: "DoJang",
    description: "Your ultimate task master!",
    url: "https://do-jang.vercel.app",
    siteName: "DoJang",
    images: [
      {
        url: "https://raw.githubusercontent.com/ethan-mason/claro-list/refs/heads/main/public/og-image.png",
        width: 1200,
        height: 630,
        alt: "DoJang - Your ultimate task master!",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};