import React from "react";
import { StatusSkeleton, BlogListSkeleton } from "./dashboard/loading";

export default function Loading() {
  return (
    <div className="space-y-6">
      <StatusSkeleton />
      <BlogListSkeleton />
    </div>
  );
}
