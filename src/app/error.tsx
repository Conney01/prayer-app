"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Sanctuary Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6 bg-white p-8 rounded-3xl border border-[#eedad2] shadow-sm">
        <div className="rounded-2xl bg-red-50 p-4 text-red-700 w-fit mx-auto border border-red-200 shadow-2xs">
          <ShieldAlert className="h-8 w-8" />
        </div>
        
        <div className="space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
            An unexpected moment occurred
          </h2>
          <p className="text-sm text-[#6b635e] leading-relaxed">
            We encountered a temporary disruption in the sanctuary. Rest assured, your data is safe. Take a deep breath and try again, or return safely home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#eedad2]/60">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto rounded-xl bg-[#2d5a3d] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1f3a28] transition shadow-xs"
          >
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#1f3a28] hover:bg-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-[#2d5a3d]" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}