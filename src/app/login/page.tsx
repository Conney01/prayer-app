import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "./form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] flex flex-col justify-between py-8 px-4 sm:px-8">
      <div className="max-w-md mx-auto w-full space-y-6">
        
        {/* Back to Home Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Login Header & Form container */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-[#eedad2] shadow-2xs mb-2">
            <span className="font-serif font-bold text-lg text-[#1f3a28]">✝</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">
            Return to Stillness
          </h1>
          <p className="text-xs text-[#6b635e]">
            Sign in to continue your daily prayer rhythm
          </p>
        </div>

        <div className="rounded-3xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-2xs">
          <LoginForm />
        </div>
      </div>

      <footer className="text-center text-xs text-[#6b635e] font-serif pt-8">
        <p>© 2026 Sanctuary. Grace over perfection.</p>
      </footer>
    </div>
  );
}