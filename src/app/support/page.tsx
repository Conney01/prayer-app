import Link from 'next/link';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { db } from '~/server/db';
import { auth } from '~/server/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = "force-dynamic";

async function submitFeedback(formData: FormData) {
  "use server";
  const session = await auth();
  const rawMessage = formData.get("message");
  const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
  if (!message) return;

  await db.feedback.create({
    data: {
      userId: session?.user?.id,
      message,
    },
  });

  revalidatePath("/support");
}

export default async function SupportPage() {
  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between pb-24 md:pb-12">
      <div>
        {/* Top Header Bar */}
        <header className="border-b border-[#eedad2] bg-[#faf3f0]/85 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold text-[#2d5a3d] hover:text-[#1f3a28] transition">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Sanctuary
            </Link>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4907a]">Support & Feedback Hub</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
          
          <div className="text-center space-y-3">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f3a28]">
              Community Feedback & Reviews
            </h1>
            <p className="text-xs sm:text-sm text-[#6b635e] max-w-xl mx-auto leading-relaxed">
              Sanctuary is entirely free and open to all. Share your thoughts, feature requests, or testimonies to help us grow.
            </p>
          </div>

          {/* Calm Support & Donations Notice */}
          <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-2xs space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
            <div className="rounded-full bg-[#fdf0ec] p-4 border border-[#eedad2] shadow-2xs flex-shrink-0 text-[#d4907a]">
              <Heart className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Support & Offerings</span>
              <h3 className="font-serif text-lg font-bold text-[#1f3a28]">
                Donations currently resting / frozen
              </h3>
              <p className="text-xs text-[#6b635e] leading-relaxed">
                Support and contributions are currently resting while we take time to settle in and keep Sanctuary completely peaceful for everyone. Your presence here is already a wonderful gift.
              </p>
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-[#faf3f0] rounded-3xl p-8 sm:p-10 border border-[#eedad2] shadow-2xs space-y-6">
            <div className="flex items-center space-x-2 text-[#d4907a] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>Your Thoughts or Suggestions</span>
            </div>

            <form action={submitFeedback} className="space-y-4">
              <textarea
                name="message"
                rows={4}
                placeholder="Share your experience, prayer requests, or feedback..."
                required
                className="w-full rounded-2xl border border-[#eedad2] bg-white p-4 text-xs text-[#1f3a28] focus:outline-none focus:border-[#2d5a3d] transition shadow-2xs resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-xl bg-[#2d5a3d] text-white px-6 py-3 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-2xs cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-emerald-900/10 bg-[#fbf5f2]/98 py-1 backdrop-blur-md md:hidden shadow-2xl touch-manipulation">
        <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="/dashboard/saved" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          Saved
        </a>
        <a href="/support" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          Support
        </a>
        <a href="/dashboard/profile" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          Profile
        </a>
      </nav>
    </div>
  );
}