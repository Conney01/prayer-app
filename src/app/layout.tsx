import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import { PWAInstallPrompt } from "~/components/pwa-install-prompt";
import "~/styles/globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const APP_NAME = "Sanctuary";
const APP_TITLE = "Sanctuary — Sacred Daily Christian Prayers";
const APP_DESCRIPTION = "A sacred, contemplative Christian prayer sanctuary to anchor your heart, release anxiety, and walk closely with God every day.";
const APP_URL = "https://sanctuary.conney.me";

export const viewport: Viewport = {
  themeColor: "#1f3a28",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_TITLE,
    template: "%s | Sanctuary",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.jpg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.jpg",
    apple: [
      { url: "/icon.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    url: APP_URL,
    images: [
      {
        url: `${APP_URL}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Sanctuary — Sacred Daily Christian Prayers",
      },
      {
        url: `${APP_URL}/icon.jpg`,
        width: 512,
        height: 512,
        alt: "Sanctuary Emblem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_TITLE,
    description: APP_DESCRIPTION,
    images: [`${APP_URL}/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="min-h-screen bg-[#fdf0ec] font-sans text-[#1f3a28] antialiased selection:bg-[#2d5a3d] selection:text-white">
        {children}
        <PWAInstallPrompt />
      </body>
    </html>
  );
}