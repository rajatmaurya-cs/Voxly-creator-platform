import React, { Suspense } from "react";
import Leaderboard from "./Leaderboard";
import LeaderboardSkeleton from "./loading-skeleton";

export const dynamic = 'force-dynamic';

const LeaderboardData = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL}/auth/topfollowers`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  const data = await res.json();

  return <Leaderboard data={data} />;
};

const page = () => {
  return (
    <Suspense fallback={<LeaderboardSkeleton />}>
      <LeaderboardData />
    </Suspense>
  );
};

export default page;