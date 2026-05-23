'use client'

import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AuthContext } from "@/app/ContextProvider/AuthProvider";

// ---------------- TYPES ----------------
type Analysis = {
  avgSentenceLength: string;
  paragraphs: number;
  sentences: number;
  totalScore: number;
  verdict: "Good" | "Average" | "Poor" | string;
  words: number;
};

type BlogReportProps = {
  type: "ai" | "human" | string;
  analysis: Analysis;
  onClose: () => void;
};

const BlogReport = ({ type, analysis, onClose }: BlogReportProps) => {

  const { user } = useContext(AuthContext);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!analysis || !mounted) return null;

  // ---------------- STYLES ----------------
  const verdictStyle =
    analysis.verdict === "Good"
      ? "text-green-300 bg-green-500/10 border-green-500/30"
      : analysis.verdict === "Average"
        ? "text-yellow-300 bg-yellow-500/10 border-yellow-500/30"
        : "text-red-300 bg-red-500/10 border-red-500/30";

  const typeStyle =
    type === "ai"
      ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
      : "bg-blue-500/10 text-blue-300 border-blue-500/30";

  const typeLabel = type === "ai" ? "🤖 AI Generated" : "👤 Human Written";

  return createPortal(
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[999] px-4">

      {/* CARD */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black shadow-2xl overflow-hidden">

        {/* glow effect */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full" />

        {/* CLOSE */}
        {/* CLOSE */}
        <button
          type="button"
          onClick={() => {
            console.log("close clicked");
            onClose();
          }}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
        >
          ✕
        </button>

        <div className="p-6 relative z-10">

          {/* HEADER */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-white">
              Blog Quality Report
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              AI-powered content analysis
            </p>

            <span className={`inline-block mt-3 px-3 py-1 text-xs rounded-full border ${typeStyle}`}>
              {typeLabel}
            </span>
          </div>

          {/* USER */}
          <div className="mt-6 flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <img
              src={user?.avatar || '/user_icon.svg'}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
            />
            <div>
              <p className="text-xs text-gray-400">Created by</p>
              <p className="text-sm font-semibold text-white">
                {user?.name || "Admin"}
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 space-y-2 text-sm text-gray-300">

            <div className="flex justify-between py-2 border-b border-white/5">
              <span>Word Count</span>
              <span className="text-white">{analysis?.words}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span>Sentences</span>
              <span className="text-white">{analysis?.sentences}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span>Paragraphs</span>
              <span className="text-white">{analysis?.paragraphs}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span>Avg Sentence Length</span>
              <span className="text-white">{analysis?.avgSentenceLength}</span>
            </div>

            <div className="flex justify-between py-3 font-semibold">
              <span>Quality Score</span>
              <span className="text-white">{analysis?.totalScore} / 100</span>
            </div>
          </div>

          {/* VERDICT */}
          <div className={`mt-5 text-center py-3 rounded-2xl border ${verdictStyle}`}>
            Verdict: {analysis?.verdict}
          </div>

          {/* FOOTER */}
          <p className="mt-5 text-[11px] text-gray-500 text-center">
            This report is auto-generated and may require human validation.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BlogReport;