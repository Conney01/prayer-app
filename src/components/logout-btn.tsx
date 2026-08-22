"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login", redirect: true });
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#6b635e] hover:text-red-600 hover:bg-[#faf3f0] transition shadow-2xs cursor-pointer"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span>Log out</span>
    </button>
  );
}