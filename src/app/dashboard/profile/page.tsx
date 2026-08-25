import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { Bookmark, Calendar, Mail, ArrowLeft, Globe, ShieldCheck } from "lucide-react";
import { LogoutButton } from "~/components/logout-btn";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      savedPrayers: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8 pb-24 sm:pb-8 flex flex-col justify-between">
      <div className="mx-auto max-w-2xl w-full space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Sanctuary</span>
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">
            User Profile
          </span>
        </div>

        {/* User Identity Card */}
        <div className="text-center space-y-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4907a]">
            Sanctuary Member
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">
            {user.name ?? "Friend"}
          </h1>
          <div className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] bg-white/60 border border-[#eedad2] px-3 py-1 rounded-full shadow-2xs">
            <Mail className="h-3.5 w-3.5 text-[#2d5a3d]" />
            <span>{user.email}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6b635e]">
              <span className="text-xs font-medium uppercase tracking-wider">Saved Prayers</span>
              <Bookmark className="h-4 w-4 text-[#2d5a3d]" />
            </div>
            <p className="font-serif text-2xl font-bold text-[#1f3a28]">
              {user.savedPrayers.length} Bookmarked
            </p>
          </div>

          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[#6b635e]">
              <span className="text-xs font-medium uppercase tracking-wider">Member Since</span>
              <Calendar className="h-4 w-4 text-[#2d5a3d]" />
            </div>
            <p className="font-serif text-xl font-bold text-[#1f3a28] mt-1">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Admin Command Center Link (Only visible to Admins) */}
        {session?.user?.role === "ADMIN" && (
          <div className="rounded-3xl border border-[#eedad2] bg-white p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#2d5a3d] text-center">
              Curator Controls
            </h3>
            <Link
              href="/admin"
              className="flex items-center justify-center space-x-2 w-full rounded-xl bg-[#2d5a3d] py-3 text-xs font-semibold text-white hover:bg-[#1f3a28] transition shadow-2xs"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Admin Command Center</span>
            </Link>
          </div>
        )}

        {/* Reach Out & Connect Card */}
        <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#6b635e] text-center">
            Reach Out &amp; Connect
          </h3>
          <div className="space-y-3">
            <a
              href="https://www.instagram.com/sanctuary.daily"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full rounded-xl border border-[#eedad2] bg-white py-3 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <Globe className="h-4 w-4 text-[#d4907a]" />
              <span>Instagram (@sanctuary.daily)</span>
            </a>

            <a
              href="mailto:mysanctuarydaily@gmail.com"
              className="flex items-center justify-center space-x-2 w-full rounded-xl border border-[#eedad2] bg-white py-3 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <Mail className="h-4 w-4 text-[#2d5a3d]" />
              <span>Email Support (mysanctuarydaily@gmail.com)</span>
            </a>
          </div>
        </div>

        {/* Footer Quote & Logout */}
        <div className="text-center space-y-4 pt-4">
          <p className="text-xs font-serif italic text-[#6b635e]">
            &ldquo;Quiet stillness in God&apos;s constant presence.&rdquo;
          </p>
          <div className="flex justify-center">
            <LogoutButton />
          </div>
        </div>

      </div>
    </div>
  );
}