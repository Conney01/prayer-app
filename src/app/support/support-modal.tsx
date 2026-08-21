"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Sparkles, Loader2, CheckCircle2, Heart, CreditCard, MessageSquare, Mail, MessageCircle, Instagram } from "lucide-react";
import { initiateMpesaDonationAction } from "~/app/actions/mpesa";

export function SupportModal() {
  const [activeTab, setActiveTab] = useState<"mpesa" | "card" | "feedback">("mpesa");
  
  // M-Pesa state
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Feedback state
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handlePreset = (val: number) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustom = (val: string) => {
    setCustomAmount(val);
    const parsed = Number(val);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");

    if (!phoneNumber.trim()) {
      setStatusMessage("Please enter your M-Pesa phone number.");
      return;
    }

    startTransition(async () => {
      const res = await initiateMpesaDonationAction({
        amount,
        phoneNumber,
        isAnonymous,
        donorName,
      });

      if (res.success) {
        setIsSuccess(true);
        setStatusMessage(res.message ?? "STK Push sent to your phone!");
      } else {
        setStatusMessage(res.error ?? "Failed to initiate M-Pesa payment.");
      }
    });
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] p-4 sm:p-8 flex flex-col justify-between">
      <div className="mx-auto max-w-xl w-full space-y-6 py-6">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xs font-medium text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Sanctuary</span>
          </Link>
          <span className="text-xs font-serif italic text-[#6b635e]">
            Support &amp; Community Hub
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-2 bg-[#faf3f0] p-1.5 rounded-2xl border border-[#eedad2]">
          <button
            type="button"
            onClick={() => setActiveTab("mpesa")}
            className={`py-2 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-1.5 ${
              activeTab === "mpesa"
                ? "bg-[#2d5a3d] text-white shadow-xs"
                : "text-[#6b635e] hover:text-[#1f3a28]"
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />
            <span>M-Pesa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("card")}
            className={`py-2 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-1.5 ${
              activeTab === "card"
                ? "bg-[#2d5a3d] text-white shadow-xs"
                : "text-[#6b635e] hover:text-[#1f3a28]"
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Card / Intl</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={`py-2 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-1.5 ${
              activeTab === "feedback"
                ? "bg-[#2d5a3d] text-white shadow-xs"
                : "text-[#6b635e] hover:text-[#1f3a28]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Reviews &amp; Ideas</span>
          </button>
        </div>

        {/* Tab 1: M-Pesa Support */}
        {activeTab === "mpesa" && (
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d]">
                <Heart className="h-6 w-6 text-red-500 fill-red-500/20" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
                Support Sanctuary via M-Pesa
              </h2>
              <p className="font-serif text-sm text-[#6b635e] max-w-sm mx-auto leading-relaxed">
                Sanctuary is entirely free and open to all. Your contributions help cover server hosting and maintenance.
              </p>
            </div>

            {statusMessage && (
              <div
                className={`rounded-xl p-4 text-xs font-medium flex items-center space-x-2 ${
                  isSuccess
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {isSuccess && <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />}
                <span>{statusMessage}</span>
              </div>
            )}

            {!isSuccess ? (
              <form onSubmit={handleDonate} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1f3a28]">
                    Select Amount (KES)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 250, 500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePreset(preset)}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition border ${
                          amount === preset && !customAmount
                            ? "bg-[#2d5a3d] text-white border-[#2d5a3d] shadow-xs"
                            : "bg-white text-[#1f3a28] border-[#eedad2] hover:border-[#2d5a3d]"
                        }`}
                      >
                        Ksh {preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount..."
                    value={customAmount}
                    onChange={(e) => handleCustom(e.target.value)}
                    className="w-full mt-2 rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1f3a28]">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3 h-4 w-4 text-[#6b635e]" />
                    <input
                      type="tel"
                      placeholder="e.g. 0712345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="w-full rounded-xl border border-[#eedad2] bg-white pl-10 pr-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {!isAnonymous && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#1f3a28]">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Aron Cornellious"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="h-4 w-4 rounded border-[#eedad2] text-[#2d5a3d] focus:ring-[#2d5a3d]"
                    />
                    <label htmlFor="anonymous" className="text-xs text-[#6b635e]">
                      Make this contribution anonymously
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Contribute Ksh {amount} via M-Pesa</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4 pt-2">
                <p className="font-serif text-sm text-[#6b635e] leading-relaxed">
                  We have triggered an M-Pesa STK push to <strong className="text-[#1f3a28]">{phoneNumber}</strong>. Please check your phone and enter your PIN to complete the contribution of <strong className="text-[#1f3a28]">Ksh {amount}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="rounded-xl border border-[#eedad2] bg-white px-5 py-2.5 text-xs font-medium text-[#1f3a28] hover:bg-[#faf3f0] transition shadow-xs"
                >
                  Make Another Contribution
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Card & International Support */}
        {activeTab === "card" && (
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d]">
              <CreditCard className="h-6 w-6 text-[#2d5a3d]" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
                Card &amp; International Support
              </h2>
              <p className="font-serif text-sm text-[#6b635e] max-w-sm mx-auto leading-relaxed">
                If you are outside Kenya or prefer supporting via debit/credit card, you can use our secure international support link below.
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://buy.stripe.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] px-6 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition"
              >
                <span>Support via Card / PayPal</span>
              </a>
            </div>
            <p className="text-[11px] text-[#6b635e]/70">
              Coming soon: direct integration with global payment gateways.
            </p>
          </div>
        )}

        {/* Tab 3: Reviews & Suggestions */}
        {activeTab === "feedback" && (
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
                Share Your Thoughts
              </h2>
              <p className="font-serif text-sm text-[#6b635e] max-w-sm mx-auto leading-relaxed">
                Have a feature suggestion, a bug report, or a review on how Sanctuary has blessed you? Let us know below!
              </p>
            </div>

            {feedbackSent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center text-xs font-medium text-emerald-800 space-y-2">
                <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-600" />
                <p>Thank you for your feedback! Your message has been received.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSent(false);
                    setFeedbackText("");
                  }}
                  className="text-xs font-semibold underline text-emerald-900 pt-1"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1f3a28]">
                    Your Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. seeker@example.com"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#eedad2] bg-white px-3.5 py-2.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1f3a28]">
                    Your Review or Suggestion *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Type your feedback here..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedad2] bg-white p-3 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition"
                >
                  <span>Submit Feedback</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Social Links Footer */}
      <footer className="w-full max-w-xl mx-auto border-t border-[#eedad2] pt-6 pb-4 text-center space-y-3">
        <span className="text-[11px] font-semibold text-[#6b635e] uppercase tracking-wider">
          Connect With Sanctuary
        </span>
        <div className="flex items-center justify-center space-x-6">
          <a
            href="mailto:support@conney.me"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </a>
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
          <a
            href="https://instagram.com/sanctuary"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}