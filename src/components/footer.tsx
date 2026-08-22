import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#eedad2] bg-[#faf3f0] text-[#1f3a28] mt-16 py-12 px-4 sm:px-8">
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-[#eedad2]/60">
        
        {/* Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-[#d4907a]">
            <Sparkles className="h-4 w-4" />
            <span className="font-serif text-lg font-bold text-[#1f3a28]">Sanctuary</span>
          </div>
          <p className="font-serif text-xs text-[#6b635e] leading-relaxed">
            Sacred Daily Christian Prayers & Devotions. Designed to anchor your heart in stillness, reflection, and continuous communion with God.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4907a]">
            Quick Sanctuary
          </h4>
          <ul className="space-y-2 text-xs font-serif text-[#6b635e]">
            <li>
              <Link href="/dashboard" className="hover:text-[#1f3a28] transition">
                Prayer Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/saved" className="hover:text-[#1f3a28] transition">
                Saved Prayers
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:text-[#1f3a28] transition">
                Support Hub & FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Mission */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4907a]">
            Devotion & Privacy
          </h4>
          <p className="font-serif text-xs text-[#6b635e] leading-relaxed">
            &ldquo;Grace over perfection.&rdquo; Your spiritual journey is private, secure, and safeguarded with care.
          </p>
          <div className="flex items-center space-x-4 text-[11px] text-[#6b635e] pt-1">
            <Link href="/privacy" className="hover:text-[#1f3a28] underline">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#1f3a28] underline">Terms</Link>
          </div>
        </div>

      </div>

      <div className="mx-auto max-w-5xl pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b635e] font-serif gap-4">
        <p>© 2026 Sanctuary. All rights reserved.</p>
        <div className="flex items-center space-x-1">
          <span>Crafted with</span>
          <Heart className="h-3 w-3 text-[#d4907a] fill-[#d4907a]" />
          <span>for daily prayer and reflection.</span>
        </div>
      </div>
    </footer>
  );
}