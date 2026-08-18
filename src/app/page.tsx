import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, BookOpen, Heart, Sun } from "lucide-react";
import { FloatingParticles } from "~/components/floating-particles";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categoriesCount = await db.category.count();
  const prayersCount = await db.prayer.count({ where: { isPublished: true } });

  return (
    <div className="relative min-h-screen bg-[#fdf0ec] text-[#1f3a28] overflow-x-hidden selection:bg-[#2d5a3d] selection:text-white">
      {/* Top Header with App Icon */}
      <header className="sticky top-0 z-40 border-b border-[#eedad2]/80 bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-xl border border-[#eedad2] bg-[#faf3f0] shadow-sm transition group-hover:border-[#2d5a3d]">
              <Image
                src="/icon.jpg"
                alt="Sanctuary Emblem"
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-serif text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-[#1f3a28] group-hover:text-[#2d5a3d] transition">
                Sanctuary
              </span>
              <p className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-[#d4907a] font-medium">
                Sacred Christian Prayers
              </p>
            </div>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-6 text-xs uppercase tracking-[0.16em] font-medium">
            <Link
              href="/login"
              className="text-[#6b635e] hover:text-[#1f3a28] transition px-2 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg sm:rounded-none bg-[#2d5a3d] px-3.5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white shadow-sm hover:bg-[#1f3a28] hover:shadow transition active:scale-95"
            >
              Begin Praying
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="relative overflow-hidden pt-12 sm:pt-24 pb-16 sm:pb-28 px-4 sm:px-8">
          <FloatingParticles />
          <div className="relative z-20 mx-auto max-w-3xl text-center space-y-6 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[#eedad2] bg-[#faf3f0] px-4 py-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#d4907a]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-[#6b635e]">
                Communion &bull; Stillness &bull; Renewal
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light italic tracking-tight text-[#1f3a28] leading-[1.14]">
              Drawing near to God, <br />
              <span className="font-normal not-italic text-[#2d5a3d]">one day at a time.</span>
            </h1>

            <p className="mx-auto max-w-xl text-sm sm:text-base text-[#6b635e] font-sans font-light leading-relaxed px-2">
              Prayer is not a duty or a performance—it is the breath of the soul. Discover quiet words to anchor your heart, release anxiety, and walk closely with your Creator every single day.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto rounded-xl sm:rounded-none bg-[#2d5a3d] px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-md hover:bg-[#1f3a28] hover:shadow-lg transition flex items-center justify-center space-x-2 active:scale-98"
              >
                <span>Begin Praying</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl sm:rounded-none border border-[#eedad2] bg-[#faf3f0] px-8 py-4 text-xs font-medium uppercase tracking-[0.22em] text-[#1f3a28] hover:border-[#2d5a3d] hover:bg-white transition flex items-center justify-center"
              >
                <span>Enter Sanctuary</span>
              </Link>
            </div>

            <div className="pt-8 sm:pt-12 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[#eedad2]/80 max-w-lg mx-auto text-center">
              <div className="p-3">
                <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1f3a28]">{categoriesCount || 16}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Curated Collections</p>
              </div>
              <div className="p-3">
                <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1f3a28]">{prayersCount > 0 ? prayersCount : "200+"}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Sacred Prayers</p>
              </div>
              <div className="p-3 col-span-2 sm:col-span-1">
                <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#1f3a28]">Daily</p>
                <p className="text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Rhythm & Streaks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="border-t border-[#eedad2] bg-[#faf3f0] py-16 sm:py-24 px-4 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#d4907a]">The Sanctuary Practice</p>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1f3a28] mt-2 font-light italic">
                A rhythm crafted for your daily walk
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-[#eedad2] bg-[#fdf0ec] p-8 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1f3a28]">Daily Scripture Anchor</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Start each day anchored in truth with curated Scripture and spiritual focus aligned with your weekly rhythm.
                </p>
              </div>

              <div className="border border-[#eedad2] bg-[#fdf0ec] p-8 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1f3a28]">Deep Situational Library</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Find tailored prayers for exact life moments—from exams and career anxiety to family blessings and midnight stillness.
                </p>
              </div>

              <div className="border border-[#eedad2] bg-[#fdf0ec] p-8 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-xl text-[#1f3a28]">Personal Sanctuary</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Save your favorite prayers, build your prayer streak flame, and cultivate consistent communion anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#eedad2] bg-[#fdf0ec] py-10 px-4 sm:px-8 text-center text-xs text-[#6b635e]">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative h-6 w-6 overflow-hidden rounded-md border border-[#eedad2]">
                <Image src="/icon.jpg" alt="Icon" fill sizes="24px" className="object-cover" />
              </div>
              <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-[#1f3a28]">
                Sanctuary
              </span>
            </div>
            <p className="text-[11px] text-[#6b635e]/80 max-w-sm mx-auto">
              A sacred space designed for peace, contemplation, and drawing near to God every day.
            </p>
            <div className="flex justify-center space-x-6 text-[10px] uppercase tracking-wider text-[#6b635e] pt-2">
              <Link href="/privacy" className="hover:text-[#1f3a28]">Privacy Policy</Link>
              <span>&bull;</span>
              <Link href="/terms" className="hover:text-[#1f3a28]">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}