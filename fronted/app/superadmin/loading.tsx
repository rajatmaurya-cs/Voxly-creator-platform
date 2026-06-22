import React from "react";
import { StatsSkeleton, LogSkeleton } from "./aiusagestats/aiusage-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <StatsSkeleton />
      <LogSkeleton />
    </div>
  );
}