import Link from 'next/link';
import { Bookmark, MessageSquare, Sparkles, Wrench, Lock, CheckCircle2, LogOut } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#fbf5f2] text-[#1f3a28] pb-28 md:pb-12">
      {/* Top Header Bar */}
      <header className="border-b border-emerald-900/10 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4907a]">Sanctuary Space</span>
          </div>
          
          <div className="hidden md:flex items-center flex-wrap gap-2">
            <Link
              href="/dashboard/saved"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <Bookmark className="h-3.5 w-3.5 text-[#2d5a3d]" />
              <span>Saved</span>
            </Link>

            <Link
              href="/support"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2 text-xs font-semibold text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#d4907a]" />
              <span>Support Hub</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center space-x-1.5 rounded-xl border border-red-900/20 bg-white px-3.5 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Maintenance / Gentle Update Notice */}
        <div className="bg-[#eedad2]/30 border border-[#eedad2] rounded-3xl p-5 mb-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#eedad2]/60 rounded-2xl flex items-center justify-center text-[#2d5a3d]">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1f3a28]">We&apos;re gently improving your space.</h3>
              <p className="text-[11px] text-emerald-800/80">Your progress is safe and will be right here when we return.</p>
            </div>
          </div>
          <Link href="/support" className="text-xs font-semibold text-[#2d5a3d] hover:underline whitespace-nowrap ml-4">
            Learn more
          </Link>
        </div>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1f3a28]">
            Welcome back, Pianella
          </h1>
        </div>

        {/* Peaceful Spiritual Growth Journey */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-900/10 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/5 rounded-bl-full pointer-events-none"></div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl flex items-center justify-center text-2xl shadow-2xs">
                🌱
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a] block">Current Growth</span>
                <h2 className="font-serif text-xl font-bold text-[#1f3a28]">Growing in Grace</h2>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#fbf5f2] text-emerald-900 text-xs font-semibold border border-emerald-900/10">
              Day 1 • Seed 🌱
            </span>
          </div>

          <p className="text-xs text-emerald-800/80 mb-6 leading-relaxed">
            Every quiet step you take matters. Your spiritual journey is safely rooted, and your progress is protected even during maintenance.
          </p>

          {/* Peaceful Progress Milestones Bar */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-6">
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-3 text-center">
              <span className="text-lg block mb-1">🌱</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Seed</span>
              <span className="text-[9px] text-emerald-800/70">Day 1+</span>
            </div>
            <div className="bg-white/60 border border-emerald-900/5 rounded-2xl p-3 text-center opacity-70">
              <span className="text-lg block mb-1">🌿</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Sprout</span>
              <span className="text-[9px] text-emerald-800/70">Day 3+</span>
            </div>
            <div className="bg-white/60 border border-emerald-900/5 rounded-2xl p-3 text-center opacity-70">
              <span className="text-lg block mb-1">🌿✨</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Young</span>
              <span className="text-[9px] text-emerald-800/70">Day 7+</span>
            </div>
            <div className="bg-white/60 border border-emerald-900/5 rounded-2xl p-3 text-center opacity-70">
              <span className="text-lg block mb-1">🌷</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Bud</span>
              <span className="text-[9px] text-emerald-800/70">Day 14+</span>
            </div>
            <div className="bg-white/60 border border-emerald-900/5 rounded-2xl p-3 text-center opacity-70">
              <span className="text-lg block mb-1">🌸</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Flower</span>
              <span className="text-[9px] text-emerald-800/70">Day 30+</span>
            </div>
            <div className="bg-white/60 border border-emerald-900/5 rounded-2xl p-3 text-center opacity-70">
              <span className="text-lg block mb-1">🌺</span>
              <span className="text-[10px] font-bold text-[#1f3a28] block">Blossom</span>
              <span className="text-[9px] text-emerald-800/70">Day 100+</span>
            </div>
          </div>

          {/* Weekly Consistency Bar */}
          <div className="grid grid-cols-7 gap-2 pt-4 border-t border-emerald-900/5">
            <div className="bg-[#2d5a3d]/10 border border-[#2d5a3d]/20 rounded-2xl p-2.5 text-center">
              <span className="text-[10px] font-bold text-emerald-900 block">SUN</span>
              <span className="text-xs font-bold text-emerald-900 block my-1">23</span>
              <span className="text-[10px] text-emerald-900">✓</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">MON</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">24</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">TUE</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">25</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">WED</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">26</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">THU</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">27</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">FRI</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">28</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
            <div className="bg-[#fbf5f2] border border-emerald-900/10 rounded-2xl p-2.5 text-center opacity-80">
              <span className="text-[10px] font-bold text-emerald-800/70 block">SAT</span>
              <span className="text-xs font-bold text-emerald-800 block my-1">29</span>
              <span className="text-[10px] text-emerald-800/50">·</span>
            </div>
          </div>
        </div>

        {/* Daily Anchor Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-emerald-900/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#d4907a]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4907a]">Daily Anchor & Reflection</span>
            </div>
            <span className="text-xs text-emerald-800/70">Daily Meditation</span>
          </div>

          <div className="bg-[#fbf5f2]/50 border border-emerald-900/10 rounded-2xl p-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#2d5a3d] block mb-2">Scripture Anchor</span>
            <p className="font-serif text-lg text-[#1f3a28] italic mb-3">
              &ldquo;The Lord is close to the brokenhearted and saves those who are crushed in spirit.&rdquo;
            </p>
            <div className="flex items-center justify-between text-xs text-emerald-800/80">
              <span>Psalm 34:18</span>
              <button className="text-[#d4907a] hover:text-[#1f3a28] transition">❤️</button>
            </div>
          </div>
        </div>

        {/* Permanent Protection Notice Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-900/10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#fbf5f2] rounded-2xl flex items-center justify-center text-[#2d5a3d]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#1f3a28]">Your peace, safely saved.</h3>
              <p className="text-[11px] text-emerald-800/80">Your moments, reflections, and growth are securely stored in the database. You&apos;ll always pick up right where you left off.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-emerald-900 bg-[#fbf5f2] px-3 py-1.5 rounded-xl border border-emerald-900/10">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#2d5a3d]" />
            <span>Protected</span>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Optimized for Instant Touch Response) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-emerald-900/10 bg-[#fbf5f2]/98 py-1 backdrop-blur-md md:hidden shadow-2xl touch-manipulation">
        <a href="/dashboard" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-emerald-900 active:scale-95 transition-transform duration-100">
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
        <a href="/login" className="flex-1 py-3 flex flex-col items-center justify-center text-[11px] font-medium text-red-700/80 hover:text-red-900 active:scale-95 transition-transform duration-100">
          <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </a>
      </nav>
    </div>
  );
}