"use client";

import { useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";

export default function AiusageStatsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard Error we see is:", error);
  }, [error]);

  return (
   <div className="flex min-h-screen items-center justify-center bg-[#050816] px-4">
  <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1220] p-6 text-center shadow-lg">
    
    {/* Icon / indicator */}
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
      <span className="text-sm text-white/60">⚠</span>
    </div>

    {/* Title */}
    <h2 className="text-lg font-semibold text-white/90">
      Failed to load dashboard
    </h2>

    {/* Message */}
    <p className="mt-2 text-sm text-white/50">
      {error.message}
    </p>

    {/* Retry button */}
    <button
      onClick={() => {
        startTransition(() => {
          router.refresh();
          reset();
        });
      }}
      className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 active:scale-[0.98]"
    >
      Retry
    </button>
  </div>
</div>
  );
}