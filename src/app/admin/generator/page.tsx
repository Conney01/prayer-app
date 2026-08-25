"use client";

import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";

export default function PostGenerator() {
  const [content, setContent] = useState("God knows what you're praying for. Trust Him even when the answer takes time. 🤍");
  const cardRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState("/logo.jpg");

  // Ensure html2canvas gets an absolute URL to avoid CORS/Tainting issues
  useEffect(() => {
    setLogoUrl(window.location.origin + "/logo.jpg");
  }, []);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current, { 
        scale: 3, 
        useCORS: true, // Only use standard CORS, no tainting
        backgroundColor: "#ffffff" // Explicit white background prevents rendering crashes
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "sanctuary-post.png";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("Something went wrong generating the image. Check the console.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf0ec] p-8 flex flex-col items-center gap-10">
      
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-bold text-[#1f3a28]">Post Generator</h1>
        <p className="text-[#6b635e] text-sm">Create downloadable Instagram graphics.</p>
      </div>

      {/* Editor Controls */}
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

      {/* Live Preview Card */}
      <div className="w-full max-w-xl border border-dashed border-[#d4907a] p-4 bg-gray-50 rounded-xl relative overflow-hidden">
        <span className="absolute -top-0 left-4 bg-[#fdf0ec] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d4907a] rounded-b-md z-10">
          Live Preview
        </span>
        
        <div ref={cardRef} className="w-full bg-white p-8 sm:p-10 mt-2 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-14 w-14 rounded-full overflow-hidden bg-black shrink-0 border border-gray-100">
              <img
                src={logoUrl} 
                alt="Sanctuary"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#1f3a28] text-[16px] leading-tight">
                Sanctuary
              </span>
              <span className="text-[#6b635e] text-[14px]">
                @sanctuary.daily
              </span>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[24px] sm:text-[28px] text-[#1f3a28] leading-[1.3] tracking-tight whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}