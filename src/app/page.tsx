import Link from "next/link";
import { Compass, BookOpen, Flame, Anchor, Feather } from "lucide-react";
import { FloatingParticles } from "~/components/floating-particles";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28]">
      {/* 1. Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#eedad2] bg-[#fdf0ec]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-8">
          <div className="flex items-center space-x-3">
            <span className="h-2 w-2 rounded-full bg-[#2d5a3d]" />
            <Link href="/" className="text-xs uppercase tracking-[0.25em] font-medium text-[#1f3a28]">
              Prayer Sanctuary
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.18em] text-[#6b635e]">
            <a href="#why-pray" className="hover:text-[#1f3a28] transition">Why We Pray</a>
            <a href="#the-practice" className="hover:text-[#1f3a28] transition">The Practice</a>
            <a href="#about" className="hover:text-[#1f3a28] transition">About</a>
          </nav>

          <div className="flex items-center space-x-6">
            <Link
              href="/login"
              className="text-xs uppercase tracking-[0.15em] text-[#1f3a28] hover:text-[#2d5a3d] transition font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-[#2d5a3d] px-6 py-2.5 text-xs uppercase tracking-[0.18em] font-medium text-white hover:bg-[#1f3a28] transition"
            >
              Begin Praying
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden border-b border-[#eedad2] py-28 sm:py-36 px-8">
        <FloatingParticles />
        <div className="relative z-20 mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#d4907a] font-medium mb-4">
            Communion &bull; Stillness &bull; Renewal
          </p>
          <h1 className="font-serif text-5xl sm:text-7xl font-light italic tracking-tight text-[#1f3a28] leading-[1.05]">
            Drawing near to God, one day at a time.
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-sans text-base sm:text-lg leading-relaxed text-[#6b635e]">
            Prayer is not a duty or a performance—it is the breath of the soul. Discover quiet words to anchor your heart, release anxiety, and walk closely with your Creator every single day.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#2d5a3d] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#1f3a28] transition"
            >
              Begin Praying
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-[#eedad2] bg-[#faf3f0] px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#1f3a28] hover:border-[#2d5a3d] transition"
            >
              Enter Sanctuary &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Motivation: Why Pray Every Day? */}
      <section id="why-pray" className="border-b border-[#eedad2] bg-[#faf3f0] py-24 px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">Daily Communion</p>
              <h2 className="font-serif text-3xl sm:text-5xl font-light italic text-[#1f3a28] mt-2 leading-tight">
                Why daily prayer transforms the human heart.
              </h2>
              <div className="space-y-4 mt-6 text-sm text-[#6b635e] leading-relaxed">
                <p>
                  In the hurry of daily life, our minds easily become scattered and burdened by worry. Daily prayer is an intentional pause where we hand our burdens back to God and remember that we are never walking alone.
                </p>
                <p>
                  Drawing close to God every day reshapes how we view our circumstances. It shifts our eyes from temporary chaos to eternal peace, cleanses our hearts of resentment, and fills us with divine wisdom before the world demands our energy.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-[#eedad2] bg-[#fdf0ec] p-5">
                  <Anchor className="h-5 w-5 text-[#2d5a3d] mb-2" />
                  <h3 className="font-serif text-base text-[#1f3a28]">An Anchor for the Soul</h3>
                  <p className="text-xs text-[#6b635e] mt-1 leading-relaxed">
                    Surrendering worries each morning grounds your thoughts in unshakable peace.
                  </p>
                </div>
                <div className="border border-[#eedad2] bg-[#fdf0ec] p-5">
                  <Feather className="h-5 w-5 text-[#2d5a3d] mb-2" />
                  <h3 className="font-serif text-base text-[#1f3a28]">Intimacy Over Eloquence</h3>
                  <p className="text-xs text-[#6b635e] mt-1 leading-relaxed">
                    God does not demand perfect words—only an honest, open, and willing heart.
                  </p>
                </div>
              </div>
            </div>

            {/* Spiritual Callout */}
            <div className="lg:col-span-5 border border-[#eedad2] bg-[#fdf0ec] p-8 sm:p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d]">
                <Flame className="h-7 w-7" />
              </div>
              <p className="font-serif text-2xl sm:text-3xl font-light italic text-[#1f3a28] leading-snug">
                &ldquo;Draw near to God, and He will draw near to you.&rdquo;
              </p>
              <div className="my-6 flex justify-center">
                <div className="h-px w-12 bg-[#d4907a]/40" />
              </div>
              <p className="text-xs text-[#6b635e] leading-relaxed">
                Consistency is not about checking a box; it is about staying connected to the Source of life, grace, and hope every day.
              </p>
              <div className="mt-6">
                <Link
                  href="/register"
                  className="inline-block bg-[#2d5a3d] px-7 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white hover:bg-[#1f3a28] transition"
                >
                  Start Your Daily Walk
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Practice (How the Sanctuary Works) */}
      <section id="the-practice" className="border-b border-[#eedad2] py-24 px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium">The Sanctuary Rhythm</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#1f3a28] mt-2">
              Pause &bull; Find &bull; Pray &bull; Return
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="border border-[#eedad2] bg-[#faf3f0] p-8">
              <span className="font-serif text-4xl italic text-[#d4907a]/40 block mb-4">01</span>
              <Compass className="h-6 w-6 text-[#2d5a3d] mb-4" />
              <h3 className="font-serif text-xl text-[#1f3a28] mb-2">Find Words for Your Season</h3>
              <p className="text-xs leading-relaxed text-[#6b635e]">
                Explore prayers crafted for life&apos;s real emotions—from deep exhaustion and difficult decisions to gratitude and healing.
              </p>
            </div>

            <div className="border border-[#eedad2] bg-[#faf3f0] p-8">
              <span className="font-serif text-4xl italic text-[#d4907a]/40 block mb-4">02</span>
              <BookOpen className="h-6 w-6 text-[#2d5a3d] mb-4" />
              <h3 className="font-serif text-xl text-[#1f3a28] mb-2">Pray Without Distractions</h3>
              <p className="text-xs leading-relaxed text-[#6b635e]">
                Experience quiet reflection in an editorial space free of algorithms, notifications, comments, or noise.
              </p>
            </div>

            <div className="border border-[#eedad2] bg-[#faf3f0] p-8">
              <span className="font-serif text-4xl italic text-[#d4907a]/40 block mb-4">03</span>
              <Flame className="h-6 w-6 text-[#2d5a3d] mb-4" />
              <h3 className="font-serif text-xl text-[#1f3a28] mb-2">Build a Sacred Habit</h3>
              <p className="text-xs leading-relaxed text-[#6b635e]">
                Return each day to nourish your spirit and gently track your daily presence with an unbroken daily streak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. About the Sanctuary */}
      <section id="about" className="py-24 px-8 border-b border-[#eedad2] bg-[#faf3f0]">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium mb-3">Our Purpose</p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light italic text-[#1f3a28]">
            Created to bring peace and spiritual grounding back to your day.
          </h2>
          <div className="my-8 flex justify-center">
            <div className="h-px w-16 bg-[#d4907a]/40" />
          </div>
          <div className="space-y-6 text-sm text-[#6b635e] leading-relaxed font-sans text-left sm:text-center">
            <p>
              In a digital world that runs on noise, outrage, and constant urgency, carving out a quiet moment for prayer can feel nearly impossible. Many times, when we need to pray the most, we find ourselves at a loss for words.
            </p>
            <p>
              Prayer Sanctuary was designed as a peaceful, digital oasis—a place where you can pause, find prayers that articulate the deep desires of your heart, and spend meaningful moments in communion with God.
            </p>
            <p className="font-serif text-lg italic text-[#1f3a28] pt-2">
              &ldquo;Be still, and know that I am God.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 6. Final Invitation */}
      <section className="py-24 px-8 bg-[#fdf0ec] text-center border-b border-[#eedad2]">
        <div className="mx-auto max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4907a] font-medium mb-3">Your Sanctuary Awaits</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-light italic text-[#1f3a28]">
            Take a moment. Be still. Pray.
          </h2>
          <p className="mt-4 text-xs text-[#6b635e] leading-relaxed">
            Enter the sanctuary whenever you need peace, strength, or words for your heart.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-block bg-[#2d5a3d] px-10 py-4 text-xs font-medium uppercase tracking-[0.25em] text-white hover:bg-[#1f3a28] transition"
            >
              Enter Sanctuary
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Editorial Footer */}
      <footer className="bg-[#1f3a28] text-white py-16 px-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6 text-xs tracking-wider">
          <div>
            <p className="uppercase tracking-[0.2em] font-serif text-sm">Prayer Sanctuary</p>
            <p className="text-white/50 text-[11px] mt-1">A prayer for every moment &bull; A quiet walk with God</p>
          </div>
          <div className="flex items-center space-x-6 text-[11px] uppercase tracking-widest text-white/70">
            <a href="#why-pray" className="hover:text-white transition">Why We Pray</a>
            <a href="#the-practice" className="hover:text-white transition">The Practice</a>
            <a href="#about" className="hover:text-white transition">About</a>
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/register" className="text-[#d4907a] hover:underline">Begin Praying</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}