import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanctuary — Sacred Daily Christian Prayer",
  description: "A peaceful place to find prayers for every moment, every situation, and every season of life.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#fdf0ec] text-[#1f3a28]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}