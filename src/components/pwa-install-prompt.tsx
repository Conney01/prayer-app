"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Share2, PlusSquare } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator && Boolean((window.navigator as unknown as { standalone: boolean }).standalone));

    if (isStandalone) {
      return;
    }

    const dismissedAt = localStorage.getItem("sanctuary_pwa_dismissed");
    if (dismissedAt) {
      const hoursSinceDismiss = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60);
      if (hoursSinceDismiss < 24) {
        return;
      }
    }

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) {
      alert("To install, open your browser menu (three dots) and select 'Install app' or 'Add to Home Screen'.");
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    localStorage.setItem("sanctuary_pwa_dismissed", Date.now().toString());
    setIsVisible(false);
    setShowIOSGuide(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-3.5 right-3.5 z-50 mx-auto max-w-md animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="relative overflow-hidden rounded-2xl border border-[#eedad2] bg-[#faf3f0]/95 p-4 sm:p-5 shadow-[0_12px_40px_rgba(31,58,40,0.18)] backdrop-blur-md">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-full p-1 text-[#6b635e] hover:bg-[#eedad2]/50 hover:text-[#1f3a28] transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {!showIOSGuide ? (
          <div className="flex items-center space-x-3.5 pr-6">
            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-[#eedad2] bg-white shadow-sm">
              <Image
                src="/icon.jpg"
                alt="Sanctuary App Icon"
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-sm font-semibold text-[#1f3a28] truncate">
                Install Sanctuary
              </h4>
              <p className="text-[11px] text-[#6b635e] leading-snug">
                Add to your home screen for quick daily prayer access and offline stillness.
              </p>
              <div className="mt-2.5 flex items-center space-x-2">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center space-x-1.5 rounded-lg bg-[#2d5a3d] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm hover:bg-[#1f3a28] transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Install App</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 text-[11px] text-[#6b635e] hover:text-[#1f3a28] transition"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="flex items-center space-x-2 text-[#2d5a3d]">
              <Share2 className="h-4 w-4" />
              <h4 className="font-serif text-sm font-semibold text-[#1f3a28]">Install on iPhone / iPad</h4>
            </div>
            <ol className="space-y-1.5 text-xs text-[#6b635e] pl-1">
              <li className="flex items-center space-x-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[10px] font-bold text-[#2d5a3d]">1</span>
                <span>Tap the <strong className="text-[#1f3a28]">Share</strong> button in Safari toolbar.</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[10px] font-bold text-[#2d5a3d]">2</span>
                <span>Scroll down and select <strong className="text-[#1f3a28] inline-flex items-center gap-1"><PlusSquare className="h-3 w-3" /> Add to Home Screen</strong>.</span>
              </li>
            </ol>
            <div className="text-right pt-1">
              <button
                onClick={handleDismiss}
                className="text-xs font-semibold text-[#2d5a3d] hover:underline"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}