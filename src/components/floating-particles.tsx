"use client";

import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-12 left-1/4 h-72 w-72 rounded-full bg-[#d4907a]/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-[#2d5a3d]/5 blur-3xl" />
      <div className="absolute -bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#d4907a]/10 blur-3xl" />
    </div>
  );
}