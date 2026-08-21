"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, Sparkles, Loader2, CheckCircle2, Heart } from "lucide-react";
import { initiateMpesaDonationAction } from "~/app/actions/mpesa";

export function SupportModal() {
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [donorName, setDonorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="min-h-screen bg-[#fdf0ec] text-[#1f3a28] p-4 sm:p-8 flex items-center justify-center">
      <div className="mx-auto max-w-lg w-full space-y-6">
        <div className="flex items-center justify-between border-b border-[#eedad2] pb-4">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 text-xs font-medium text-[#6b635e] hover:text-[#1f3a28] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Sanctuary</span>
          </Link>
          <span className="text-xs font-serif italic text-[#6b635e]">
            M-Pesa Support
          </span>
        </div>

        <div className="rounded-2xl border border-[#eedad2] bg-[#faf3f0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#2d5a3d]/10 text-[#2d5a3d]">
              <Heart className="h-6 w-6 text-red-500 fill-red-500/20" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1f3a28]">
              Support Sanctuary Development
            </h2>
            <p className="font-serif text-sm text-[#6b635e] max-w-sm mx-auto leading-relaxed">
              Sanctuary is entirely free and open to all. If this quiet space has blessed your spiritual walk, you can support server hosting and maintenance via M-Pesa.
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
      </div>
    </div>
  );
}