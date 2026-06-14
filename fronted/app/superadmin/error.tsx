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
   <div className="flex min-h-screen items-center justify-center bg-white px-4">
  <div 
    className="w-full max-w-md rounded-xl border bg-zinc-50 p-6 text-center shadow-xs"
    style={{ borderColor: "#e4e4e7" }}
  >
    
    {/* Icon / indicator */}
    <div 
      className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-black"
      style={{ borderColor: "#e4e4e7" }}
    >
      <span className="text-xs">⚠</span>
    </div>

    {/* Title */}
    <div className="text-sm font-bold tracking-tight text-black">
      Failed to Load Dashboard
    </div>

    {/* Message */}
    <p className="mt-2 text-xs text-zinc-650 font-bold">
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
      className="mt-6 w-full rounded-lg border bg-black px-4 py-2.5 text-xs font-bold tracking-wide text-white transition hover:bg-zinc-850"
      style={{ borderColor: "#000000" }}
    >
      Retry
    </button>
  </div>
</div>
  );
}