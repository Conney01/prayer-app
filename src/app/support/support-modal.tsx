"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Sparkles, Loader2, CheckCircle2, Heart, MessageSquare } from "lucide-react";
import { initiateMpesaDonationAction } from "~/app/actions/mpesa";
import { submitFeedbackAction } from "~/app/actions/feedback";

export function SupportModal() {
  const [activeTab, setActiveTab] = useState<"mpesa" | "feedback">("mpesa");
  
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
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackPending, startFeedbackTransition] = useTransition();

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
    setFeedbackStatus("");

    if (!feedbackText.trim()) {
      setFeedbackStatus("Please enter your review or suggestion.");
      return;
    }

    startFeedbackTransition(async () => {
      const res = await submitFeedbackAction({
        email: feedbackEmail,
        message: feedbackText,
      });

      if (res.success) {
        setFeedbackSent(true);
      } else {
        setFeedbackStatus(res.error ?? "Failed to submit feedback.");
      }
    });
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

        {/* Tab Switcher (M-Pesa and Feedback only) */}
        <div className="grid grid-cols-2 gap-2 bg-[#faf3f0] p-1.5 rounded-2xl border border-[#eedad2]">
          <button
            type="button"
            onClick={() => setActiveTab("mpesa")}
            className={`py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-2 ${
              activeTab === "mpesa"
                ? "bg-[#2d5a3d] text-white shadow-xs"
                : "text-[#6b635e] hover:text-[#1f3a28]"
            }`}
          >
            <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />
            <span>Support via M-Pesa</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("feedback")}
            className={`py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center space-x-2 ${
              activeTab === "feedback"
                ? "bg-[#2d5a3d] text-white shadow-xs"
                : "text-[#6b635e] hover:text-[#1f3a28]"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Reviews &amp; Feedback</span>
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

        {/* Tab 2: Reviews & Feedback */}
        {activeTab === "feedback" && (
          <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
                Share Your Experience
              </h2>
              <p className="font-serif text-sm text-[#6b635e] max-w-sm mx-auto leading-relaxed">
                How has your experience been with Sanctuary? Let us know your thoughts and how we can improve your quiet space.
              </p>
            </div>

            {feedbackStatus && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800">
                {feedbackStatus}
              </div>
            )}

            {feedbackSent ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center text-xs font-medium text-emerald-800 space-y-3">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600" />
                <p className="font-serif text-sm">Thank you! Your feedback has been sent directly to the Sanctuary team.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackSent(false);
                    setFeedbackText("");
                    setFeedbackEmail("");
                  }}
                  className="rounded-xl bg-white border border-emerald-300 px-4 py-2 font-semibold text-emerald-900 hover:bg-emerald-100 transition shadow-xs"
                >
                  Send Another Message
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
                    Your Experience &amp; Suggestions *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How is your experience with Sanctuary? How can we improve?"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    required
                    className="w-full rounded-xl border border-[#eedad2] bg-white p-3.5 text-xs text-[#1f3a28] focus:border-[#2d5a3d] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackPending}
                  className="w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-[#2d5a3d] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#1f3a28] transition disabled:opacity-50"
                >
                  {feedbackPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Submit Feedback to Admin</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Social & Inquiries Footer with Real Icons */}
      <footer className="w-full max-w-xl mx-auto border-t border-[#eedad2] pt-6 pb-4 text-center space-y-3">
        <span className="text-[11px] font-semibold text-[#6b635e] uppercase tracking-wider">
          Inquiries &amp; Connect With Sanctuary
        </span>
        <div className="flex items-center justify-center space-x-6">
          {/* Gmail / Email Icon */}
          <a
            href="mailto:support@conney.me"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            <span>Gmail</span>
          </a>
          {/* WhatsApp Icon */}
          <a
            href="https://wa.me/254700000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
          {/* Instagram Icon */}
          <a
            href="https://instagram.com/sanctuary"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs text-[#6b635e] hover:text-[#2d5a3d] transition"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}