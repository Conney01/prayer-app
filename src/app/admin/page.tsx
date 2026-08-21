import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { ShieldCheck, ArrowLeft, MessageSquare, Mail, Calendar, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const prayers = await db.prayer.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const feedbacks = await db.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] py-8 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between border-b border-[#eedad2] pb-6">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-7 w-7 text-[#2d5a3d]" />
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f3a28]">
                Admin Curator Panel
              </h1>
              <p className="text-xs text-[#6b635e]">
                Manage prayer collections, devotions, and view user feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/admin/prayers/new"
              className="rounded-xl bg-[#2d5a3d] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition"
            >
              + New Prayer
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-[#faf3f0] px-4 py-2 text-xs font-semibold text-[#6b635e] hover:bg-white shadow-xs transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </div>
        </header>

        {/* User Feedback & Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-[#2d5a3d]" />
              <h2 className="font-serif text-lg font-bold text-[#1f3a28]">
                User Feedback &amp; Suggestions ({feedbacks.length})
              </h2>
            </div>
            <span className="text-xs text-[#6b635e]">Received from Support Hub</span>
          </div>

          {feedbacks.length === 0 ? (
            <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 text-center text-xs text-[#6b635e]">
              No feedback received from users yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6b635e] border-b border-[#eedad2]/50 pb-2">
                    <span className="flex items-center space-x-1.5 font-medium text-[#1f3a28]">
                      <Mail className="h-3.5 w-3.5 text-[#2d5a3d]" />
                      <span>{fb.email || "Anonymous Seeker"}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>
                  <p className="font-serif text-xs sm:text-sm text-[#1f3a28] leading-relaxed">
                    &ldquo;{fb.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Existing Prayers Management */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-2">
            <h2 className="font-serif text-lg font-bold text-[#1f3a28]">
              Published Prayers ({prayers.length})
            </h2>
            <span className="text-xs text-[#6b635e]">{categories.length} Categories</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {prayers.map((prayer) => (
              <div
                key={prayer.id}
                className="flex items-center justify-between rounded-xl border border-[#eedad2] bg-[#faf3f0] p-4 shadow-2xs hover:bg-white transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4907a]">
                      {prayer.category.name}
                    </span>
                    {prayer.isFeatured && (
                      <span className="rounded-full bg-[#2d5a3d]/10 px-2 py-0.5 text-[9px] font-bold text-[#2d5a3d]">
                        Daily Devotion
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-sm font-bold text-[#1f3a28]">
                    {prayer.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/prayers/${prayer.id}/edit`}
                    className="rounded-lg border border-[#eedad2] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}