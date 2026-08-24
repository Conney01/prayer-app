"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";

// We define the exact shape of Chrome's install event so TypeScript is happy
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      // Prevent Chrome's default mini-infobar from appearing
      promptEvent.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(promptEvent);
      // Show our custom floating UI
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the native install prompt
    await deferredPrompt.prompt();
    
    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }
    
    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-white border border-[#eedad2] shadow-2xl rounded-2xl p-4 z-50 flex items-start gap-4 animate-in slide-in-from-bottom-5">
      <div className="flex-1 space-y-1">
        <h4 className="font-serif font-bold text-[#1f3a28] text-sm">
          Install Sanctuary
        </h4>
        <p className="text-xs text-[#6b635e]">
          Add to your home screen for the best experience, offline access, and zero ads.
        </p>
      </div>
      
      <div className="flex flex-col gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="flex items-center justify-center space-x-1.5 bg-[#2d5a3d] text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-[#1f3a28] transition shadow-xs"
        >
          <Download className="h-3 w-3" />
          <span>Install</span>
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="text-[#6b635e] hover:text-[#1f3a28] text-[10px] font-semibold uppercase tracking-wider text-center transition"
        >
          Not Now
        </button>
      </div>
    </div>
  );
}