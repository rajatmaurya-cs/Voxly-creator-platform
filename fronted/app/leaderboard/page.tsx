import React from "react";
import Leaderboard from "./Leaderboard";

export const dynamic = 'force-dynamic';

const page = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/topfollowers`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  const data = await res.json();
  console.log("The Top Followers are: ",data)
  return <Leaderboard data={data} />;
};

export default page;