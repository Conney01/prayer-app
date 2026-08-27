"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

export default function PostGenerator() {
  const [content, setContent] = useState("God knows what you're praying for. Trust Him even when the answer takes time. 🤍");
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await toPng(cardRef.current, { 
        pixelRatio: 3, 
        backgroundColor: "#ffffff",
        skipFonts: false
      });
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "sanctuary-post.png";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] p-8 flex flex-col items-center gap-10">
      
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">Post Generator</h1>
        <p className="text-[#6b635e] text-sm">Create downloadable Instagram graphics.</p>
      </div>

      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-[#eedad2] space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#6b635e]">
          Post Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-24 p-3 border border-[#eedad2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]"
          placeholder="Type your devotion here..."
        />
        
        <button
          onClick={downloadImage}
          className="w-full flex items-center justify-center gap-2 bg-[#2d5a3d] text-white py-3 rounded-xl font-semibold hover:bg-[#1f3a28] transition"
        >
          <Download className="w-4 h-4" />
          Download for Instagram
        </button>
      </div>

      <div className="w-full max-w-xl border border-dashed border-[#d4907a] p-4 bg-gray-50 rounded-xl relative overflow-hidden flex justify-center">
        <span className="absolute -top-0 left-4 bg-[#fdf0ec] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4907a] rounded-b-md z-10">
          Live Preview
        </span>
        
        {/* Exact Twitter/X Style Layout */}
        <div ref={cardRef} className="w-full max-w-[450px] bg-white p-4 sm:p-5 mt-2 rounded-lg">
          {/* Header: Avatar + Info */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
              <img
                src="/logo.jpg" 
                alt="Sanctuary"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1">
                <span className="font-bold text-[#1f3a28] text-[15px] leading-tight">
                  Sanctuary
                </span>
                {/* Authentic Blue Verified Badge */}
                <svg className="w-[1.1rem] h-[1.1rem] text-[#1d9bf0]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.522.846 2.872 2.088 3.535.035.592.193 1.155.452 1.67.666 1.33 2.03 2.21 3.585 2.21.3 0 .6-.037.89-.108.97 1.33 2.5 2.21 4.237 2.21s3.267-.88 4.237-2.21c.29.07.59.108.89.108 1.555 0 2.92-.88 3.585-2.21.258-.515.416-1.078.452-1.67 1.242-.663 2.088-2.013 2.088-3.535zm-11.05 4.805l-4.22-4.22 1.415-1.414 2.805 2.806 6.32-6.32 1.414 1.414-7.734 7.734z" />
                </svg>
              </div>
              <span className="text-[#6b635e] text-[14px] leading-tight mt-0.5">
                @sanctuary.daily
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="mt-3">
            <p className="text-[15px] text-[#1f3a28] leading-[1.4] whitespace-pre-wrap text-left font-sans">
              {content}
            </p>
          </div>
        </div>
        
      </div>

    </div>
  );
}