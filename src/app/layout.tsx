import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoJang",
  description: "Your ultimate task master!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
