import type { Metadata, Viewport } from "next";
import "~/styles/globals.css";
import { PwaRegister } from "~/components/pwa-register";

export const metadata: Metadata = {
  title: "Sanctuary | Daily Stillness & Prayer",
  description: "Create a personal space to save your favorite devotions, manage prayer rhythms, and find daily stillness. Grace over perfection.",
  metadataBase: new URL("https://mysanctuary.live"),
  openGraph: {
    title: "Sanctuary | Daily Stillness & Prayer",
    description: "A peaceful space for daily stillness and devotions.",
    url: "https://mysanctuary.live",
    siteName: "Sanctuary",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", type: "image/png" }],
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