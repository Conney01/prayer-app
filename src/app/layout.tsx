import type { Metadata, Viewport } from "next";
import "~/styles/globals.css";
import { PwaRegister } from "~/components/pwa-register";

export const metadata: Metadata = {
  title: "Sanctuary — A Peaceful Space for Prayer",
  description: "A thoughtfully curated digital prayer companion designed to nurture personal communion with God.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: { url: "/icon.jpg", type: "image/jpeg" },
    shortcut: { url: "/icon.jpg", type: "image/jpeg" },
    apple: { url: "/apple-touch-icon.jpg", type: "image/jpeg" },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sanctuary",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f3a28",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#fdf0ec] text-[#1f3a28]">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}