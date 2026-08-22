import { auth, signOut } from "~/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Heart, Flame, BookOpen } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get the first name or fallback gracefully to Aron
  const firstName = session.user.name?.split(" ")[0] || "Aron";

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] selection:bg-[#eedad2]">
      
      {/* Top Navigation */}
      <header className="w-full border-b border-[#eedad2]/60 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif font-bold text-xs tracking-wide text-[#1f3a28] hover:text-[#2d5a3d] transition">
            • PRAYER SANCTUARY
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/saved" className="hidden sm:flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6b635e] hover:text-[#1f3a28] transition bg-white px-3 py-1.5 rounded-lg border border-[#eedad2] shadow-2xs">
              <Heart className="h-3.5 w-3.5" />
              <span>Saved</span>
            </Link>
            
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="flex items-center space-x-1.5 text-[11px] font-semibold uppercase tracking-widest text-[#6b635e] hover:text-[#1f3a28] transition bg-white px-3 py-1.5 rounded-lg border border-[#eedad2] shadow-2xs cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Welcome Header */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4907a]">Sanctuary Space</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1f3a28]">
            Welcome back, {firstName}
          </h1>
        </div>

        {/* Streak & Activity Card */}
        <div className="rounded-3xl border border-[#eedad2] bg-white/70 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdf0ec] text-[#d4907a]">
                <Flame className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#1f3a28]">1 Day in Stillness</h3>
                <p className="text-[11px] text-[#6b635e]">Active streak • Every breath in prayer counts.</p>
              </div>
            </div>
            <div className="hidden sm:block text-[10px] font-medium uppercase tracking-widest text-[#2d5a3d] bg-[#fdf0ec] px-3 py-1.5 rounded-full border border-[#eedad2]">
              Grace over perfection
            </div>
          </div>

          {/* Simple weekly visual */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
              <div key={day} className={`flex flex-col items-center justify-center py-3 rounded-xl border ${i === 6 ? 'border-[#d4907a] bg-[#fdf0ec]' : 'border-[#eedad2] bg-white'} text-[10px]`}>
                <span className={`font-bold ${i === 6 ? 'text-[#d4907a]' : 'text-[#6b635e]'}`}>{day}</span>
                <span className={`text-xs mt-1 ${i === 6 ? 'text-[#1f3a28] font-bold' : 'text-[#1f3a28]'}`}>{16 + i}</span>
                {i === 6 && <span className="text-[8px] text-[#d4907a] mt-1 font-bold uppercase tracking-widest">Today</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Anchor */}
        <div className="rounded-3xl border border-[#eedad2] bg-white/70 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#eedad2]/60 pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#d4907a] flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Sacred Anchor & Reflection</span>
            </span>
            <span className="text-[10px] font-serif text-[#6b635e] italic">Daily Meditation</span>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b635e]">Scripture Anchor</span>
            <blockquote className="font-serif text-xl sm:text-2xl text-[#1f3a28] italic border-l-2 border-[#d4907a] pl-6 py-2 leading-relaxed">
              "Cast all your anxiety on him because he cares for you."
            </blockquote>
            <p className="text-xs text-[#6b635e] pl-6 font-medium">— 1 Peter 5:7</p>
          </div>

          <div className="pt-6 border-t border-[#eedad2]/60 space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b635e]">Guided Prayer</span>
            <p className="font-serif text-sm text-[#1f3a28] leading-relaxed">
              Lord, I release the burdens I was never meant to carry. My anxieties, my fears of the unknown, and the weight of today’s demands—I hand them over to You. Fill the spaces of my worry with Your abiding peace. Amen.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}