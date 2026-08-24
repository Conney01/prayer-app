import Link from 'next/link';
import { Bookmark, ArrowLeft, ArrowRight, Heart } from 'lucide-react';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function SavedPrayersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch saved prayers for the logged-in user from the database
  const savedPrayersRecords = await db.savedPrayer.findMany({
    where: { userId: session.user.id },
    include: {
      prayer: {
        include: {
          category: true,
          situation: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between pb-24 md:pb-12">
      <div>
        {/* Top Header Bar */}
        <header className="border-b border-[#eedad2] bg-[#faf3f0]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold text-[#2d5a3d] hover:text-[#1f3a28] transition">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Sanctuary
            </Link>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4907a]">Saved Sanctuary ({savedPrayersRecords.length})</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {savedPrayersRecords.length === 0 ? (
            <div className="bg-[#faf3f0] rounded-3xl p-12 text-center border border-[#eedad2] shadow-2xs">
              <div className="w-16 h-16 bg-[#fdf0ec] rounded-full flex items-center justify-center mx-auto mb-4 text-[#d4907a] border border-[#eedad2]">
                <Bookmark className="h-8 w-8" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#1f3a28] mb-2">Your Sanctuary is Empty</h1>
              <p className="text-sm text-[#6b635e] max-w-md mx-auto mb-6">
                Prayers, devotions, and scripture anchors you bookmark will appear here for easy reflection and stillness.
              </p>
              <Link 
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-[#2d5a3d] text-white px-6 py-3 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-2xs"
              >
                Explore Prayer Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-6">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1f3a28]">Your Saved Sanctuary</h1>
                <p className="text-xs text-[#6b635e] mt-1">
                  Your bookmarked prayers and meditations for daily reflection.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {savedPrayersRecords.map(({ prayer }) => (
                  <Link
                    key={prayer.id}
                    href={`/prayers/${prayer.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between border border-[#eedad2] bg-[#faf3f0] p-6 rounded-3xl transition-all duration-300 hover:border-[#2d5a3d] hover:shadow-sm gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#d4907a]">
                          {prayer.category.name} {prayer.situation ? `• ${prayer.situation.name}` : ""}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                        {prayer.title}
                      </h3>
                      <p className="text-xs text-[#6b635e] line-clamp-2 max-w-2xl leading-relaxed">
                        {prayer.body}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#eedad2]">
                      <Heart className="h-4 w-4 fill-[#d4907a] text-[#d4907a]" />
                      <div className="flex items-center text-xs uppercase tracking-[0.15em] text-[#2d5a3d] font-medium whitespace-nowrap">
                        <span>Pray</span>
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-emerald-900/10 bg-[#fbf5f2]/98 py-1 backdrop-blur-md md:hidden shadow-2xl touch-manipulation">
        <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          Home
        </a>
        <a href="/dashboard/saved" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          Saved
        </a>
        <a href="/support" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-800/80 hover:text-emerald-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          Support
        </a>
        <a href="/login" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-red-700/80 hover:text-red-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </a>
      </nav>
    </div>
  );
}