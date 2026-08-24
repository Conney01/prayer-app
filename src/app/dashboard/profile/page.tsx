import Link from 'next/link';
import { User, ArrowLeft, Mail, Calendar, Bookmark, Edit3 } from 'lucide-react';
import { auth } from '~/server/auth';
import { db } from '~/server/db';
import { redirect } from 'next/navigation';
import { LogoutButton } from '~/components/logout-btn';
import { updateProfileName } from '~/app/actions/profile-actions';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      savedPrayers: true,
    },
  });

  const displayName = user?.name ?? session.user.name ?? "Aron Cornellious";

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between pb-24 md:pb-12">
      <div>
        {/* Top Header Bar */}
        <header className="border-b border-[#eedad2] bg-[#faf3f0]/85 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold text-[#2d5a3d] hover:text-[#1f3a28] transition">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Sanctuary
            </Link>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4907a]">User Profile</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          <div className="bg-[#faf3f0] rounded-3xl p-8 sm:p-10 border border-[#eedad2] shadow-2xs space-y-8">
            
            {/* User Header Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
              <div className="w-20 h-20 bg-[#fdf0ec] rounded-full flex items-center justify-center text-[#2d5a3d] border-2 border-[#d4907a] shadow-xs flex-shrink-0">
                <User className="h-10 w-10 text-[#d4907a]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Sanctuary Member</span>
                <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">
                  {displayName}
                </h1>
                <p className="text-xs text-[#6b635e] flex items-center justify-center sm:justify-start pt-0.5">
                  <Mail className="h-3.5 w-3.5 mr-1.5 text-[#d4907a]" /> {user?.email ?? session.user.email}
                </p>
              </div>
            </div>

            {/* Profile Statistics Grid (Saved Prayers & Member Since) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#eedad2]">
              <div className="bg-white rounded-2xl p-6 border border-[#eedad2] shadow-2xs text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">Saved Prayers</span>
                <p className="font-serif text-lg font-bold text-[#1f3a28] flex items-center justify-center pt-1">
                  <Bookmark className="h-4 w-4 mr-1.5 text-[#2d5a3d]" /> {user?.savedPrayers?.length ?? 0} Bookmarked
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#eedad2] shadow-2xs text-center space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b635e]">Member Since</span>
                <p className="font-serif text-lg font-bold text-[#1f3a28] flex items-center justify-center pt-1">
                  <Calendar className="h-4 w-4 mr-1.5 text-[#d4907a]" /> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}
                </p>
              </div>
            </div>

            {/* Edit Name Form Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#eedad2] shadow-2xs space-y-4">
              <div className="flex items-center space-x-2 text-[#d4907a] text-xs font-semibold uppercase tracking-wider">
                <Edit3 className="h-4 w-4" />
                <span>Update Display Name</span>
              </div>

              <form action={updateProfileName} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  name="name"
                  defaultValue={displayName}
                  placeholder="Enter your display name"
                  required
                  className="w-full flex-1 rounded-xl border border-[#eedad2] bg-[#fdf0ec]/50 px-4 py-3 text-xs text-[#1f3a28] focus:outline-none focus:border-[#2d5a3d] transition"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#2d5a3d] text-white px-6 py-3 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-2xs cursor-pointer"
                >
                  Save Name
                </button>
              </form>
            </div>

            {/* Footer / Logout */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#eedad2]">
              <p className="text-xs text-[#6b635e] italic">
                &ldquo;Quiet stillness in God&apos;s constant presence.&rdquo;
              </p>
              <LogoutButton />
            </div>
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