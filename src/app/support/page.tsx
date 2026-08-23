'use client';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

export default function SupportPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setSubmitted(true);
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-[#fbf5f2] text-[#1f3a28] pb-24 md:pb-12">
      {/* Top Header Bar */}
      <header className="border-b border-emerald-900/10 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center text-xs font-semibold text-emerald-800 hover:text-emerald-900 transition">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Sanctuary
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4907a]">Support & Feedback Hub</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#2d5a3d]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#2d5a3d]">
            <MessageSquare className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">Community Feedback & Reviews</h1>
          <p className="text-sm text-emerald-800/80 mt-2">
            Sanctuary is entirely free and open to all. Share your thoughts, feature requests, or testimonies to help us grow.
          </p>
        </div>

        {/* Notice on M-Pesa Freeze */}
        <div className="bg-[#eedad2]/40 border border-[#eedad2] rounded-2xl p-5 mb-8 text-xs text-[#1f3a28]">
          <span className="font-bold uppercase tracking-wider text-[#d4907a] block mb-1">M-Pesa Contributions Notice</span>
          M-Pesa support contributions are currently frozen while we finalize our official till number and allow our community to fully familiarize themselves with Sanctuary. Thank you for your patience!
        </div>

        {/* Feedback Form Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-emerald-900/10">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-3">
                ✓
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1f3a28]">Thank You for Your Feedback!</h3>
              <p className="text-xs text-emerald-800/80 mt-1">Your message has been received and helps shape Sanctuary.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2d5a3d] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#1f3a28] transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1f3a28] mb-2">
                  Your Thoughts or Suggestions
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience, prayer requests, or feedback..."
                  required
                  className="w-full rounded-2xl border border-emerald-900/15 bg-[#fbf5f2]/50 p-4 text-sm text-[#1f3a28] focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-xl bg-[#2d5a3d] text-white px-6 py-3.5 text-xs font-semibold hover:bg-[#1f3a28] transition shadow-sm"
              >
                <Send className="h-4 w-4 mr-2" /> Submit Feedback
              </button>
            </form>
          )}
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