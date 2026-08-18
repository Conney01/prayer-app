"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Shield, Menu, X, Home, BookOpen, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  streak: number;
  isAdmin: boolean;
}

export function Navbar({ streak, isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-18 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative h-8 w-8 sm:h-9 sm:w-9 overflow-hidden rounded-lg border border-[#eedad2] bg-[#faf3f0] shadow-sm transition group-hover:border-[#2d5a3d]">
            <Image
              src="/logo.jpg"
              alt="Sanctuary Emblem"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <span className="font-serif text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
            Sanctuary
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 text-xs uppercase tracking-[0.15em] font-medium text-[#6b635e]">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center space-x-1.5 text-[#2d5a3d] font-semibold hover:text-[#1f3a28] transition"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Curator</span>
            </Link>
          )}

          <div className="flex items-center space-x-2 border border-orange-200/60 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-3.5 py-1.5 shadow-[0_0_12px_rgba(249,115,22,0.2)]">
            <Flame className="h-4 w-4 fill-orange-500 text-amber-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.9)] animate-pulse" />
            <span className="font-semibold text-orange-800">{streak} Day Streak</span>
          </div>

          <Link href="/" className="hover:text-[#1f3a28] transition">
            Home
          </Link>

          <button
            type="button"
            onClick={() => {
              void signOut({ callbackUrl: "/" });
            }}
            className="text-[#6b635e] hover:text-[#1f3a28] transition cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        <div className="flex items-center space-x-3 md:hidden">
          <div className="flex items-center space-x-1.5 border border-orange-200/60 bg-orange-500/10 px-2.5 py-1 text-xs">
            <Flame className="h-3.5 w-3.5 fill-orange-500 text-amber-500 animate-pulse" />
            <span className="font-bold text-orange-800">{streak}d</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open navigation menu"}
            className="flex h-10 w-10 items-center justify-center border border-[#eedad2] bg-[#faf3f0] text-[#1f3a28] active:bg-[#eedad2]"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-b border-[#eedad2] bg-[#faf3f0] px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-[#1f3a28] border-b border-[#eedad2]/60"
            >
              <BookOpen className="h-4 w-4 text-[#2d5a3d]" />
              <span>Sanctuary Library</span>
            </Link>

            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 py-2.5 text-xs uppercase tracking-[0.2em] font-medium text-[#1f3a28] border-b border-[#eedad2]/60"
            >
              <Home className="h-4 w-4 text-[#2d5a3d]" />
              <span>Home Page</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#2d5a3d] border-b border-[#eedad2]/60"
              >
                <Shield className="h-4 w-4" />
                <span>Admin Curator Portal</span>
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              void signOut({ callbackUrl: "/" });
            }}
            className="w-full flex items-center justify-center space-x-2 border border-rose-200 bg-rose-50 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-800 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
}