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
      {/* Mobile & Desktop Header */}
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-20 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-9 w-9 sm:h-11 sm:w-11 flex-shrink-0 overflow-hidden rounded-xl border border-[#eedad2] bg-[#faf3f0] shadow-sm transition group-hover:border-[#2d5a3d]">
              <Image
                src="/icon.jpg"
                alt="Sanctuary Emblem"
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base sm:text-lg font-semibold uppercase tracking-[0.2em] text-[#1f3a28] leading-tight">
                Sanctuary
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#d4907a] font-medium hidden sm:block">
                Daily Christian Prayers
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/login"
              className="px-3 py-2 text-xs uppercase tracking-[0.15em] font-medium text-[#6b635e] hover:text-[#1f3a28] transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-[#2d5a3d] px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-sm hover:bg-[#1f3a28] active:scale-95 transition"
            >
              Begin Praying
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="relative overflow-hidden pt-8 sm:pt-20 pb-12 sm:pb-24 px-4 sm:px-8">
          <FloatingParticles />
          <div className="relative z-20 mx-auto max-w-2xl text-center space-y-5 sm:space-y-8">
            <div className="inline-flex items-center space-x-2 rounded-full border border-[#eedad2] bg-[#faf3f0] px-4 py-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#d4907a]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-medium text-[#6b635e]">
                Communion &bull; Stillness &bull; Renewal
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-6xl font-light italic tracking-tight text-[#1f3a28] leading-[1.18]">
              Drawing near to God, <br />
              <span className="font-normal not-italic text-[#2d5a3d]">one day at a time.</span>
            </h1>

            <p className="mx-auto max-w-lg text-xs sm:text-base text-[#6b635e] font-sans font-light leading-relaxed px-1">
              Prayer is not a duty or a performance—it is the breath of the soul. Discover quiet words to anchor your heart, release anxiety, and walk closely with your Creator every single day.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto rounded-xl bg-[#2d5a3d] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-md hover:bg-[#1f3a28] transition flex items-center justify-center space-x-2"
              >
                <span>Begin Praying</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-xl border border-[#eedad2] bg-[#faf3f0] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-[#1f3a28] hover:border-[#2d5a3d] hover:bg-white transition flex items-center justify-center"
              >
                <span>Enter Sanctuary</span>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-2 border-t border-[#eedad2] max-w-md mx-auto text-center">
              <div className="p-2">
                <p className="font-serif text-xl sm:text-3xl font-semibold text-[#1f3a28]">{categoriesCount || 16}</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Collections</p>
              </div>
              <div className="p-2 border-x border-[#eedad2]">
                <p className="font-serif text-xl sm:text-3xl font-semibold text-[#1f3a28]">{prayersCount > 0 ? prayersCount : "200+"}</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Prayers</p>
              </div>
              <div className="p-2">
                <p className="font-serif text-xl sm:text-3xl font-semibold text-[#1f3a28]">Daily</p>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#d4907a] mt-0.5">Streaks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="border-t border-[#eedad2] bg-[#faf3f0] py-12 sm:py-20 px-4 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-[#d4907a]">The Sanctuary Practice</p>
              <h2 className="font-serif text-2xl sm:text-4xl text-[#1f3a28] mt-1 font-light italic">
                A rhythm crafted for your daily walk
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="rounded-2xl border border-[#eedad2] bg-[#fdf0ec] p-6 space-y-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg text-[#1f3a28]">Daily Scripture Anchor</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Start each morning anchored in truth with curated Scripture aligned with your weekly spiritual rhythm.
                </p>
              </div>

              <div className="rounded-2xl border border-[#eedad2] bg-[#fdf0ec] p-6 space-y-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg text-[#1f3a28]">Situational Prayers</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Tailored prayers for specific life moments—from exams and career anxiety to family peace and midnight stillness.
                </p>
              </div>

              <div className="rounded-2xl border border-[#eedad2] bg-[#fdf0ec] p-6 space-y-3 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-[#2d5a3d]/10 text-[#2d5a3d] flex items-center justify-center">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg text-[#1f3a28]">Personal Sanctuary</h3>
                <p className="text-xs text-[#6b635e] leading-relaxed">
                  Save your favorite prayers, build your prayer streak flame, and cultivate consistent communion anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#eedad2] bg-[#fdf0ec] py-8 px-4 text-center text-xs text-[#6b635e]">
          <div className="mx-auto max-w-md space-y-3">
            <div className="flex items-center justify-center space-x-2.5">
              <div className="relative h-6 w-6 overflow-hidden rounded-lg border border-[#eedad2]">
                <Image src="/icon.jpg" alt="Icon" fill sizes="24px" className="object-cover" />
              </div>
              <span className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-[#1f3a28]">
                Sanctuary
              </span>
            </div>
            <p className="text-[11px] text-[#6b635e]">
              A quiet space for peace, contemplation, and drawing near to God daily.
            </p>
            <div className="flex justify-center space-x-4 text-[10px] uppercase tracking-wider text-[#6b635e]">
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