import React from "react";
import Image from "next/image";

type User = {
  _id: string;
  fullName: string;
  avatar?: string;
  role: string;
  followersCount: number;
};

type LeaderboardProps = {
  data?: {
    success: boolean;
    users: User[];
  };
};

const Leaderboard = ({ data }: LeaderboardProps) => {

  const users = data?.users || [];

  const topThree = users.slice(0, 3);
  const remaining = users.slice(3);


  const getInitials = (name: string) => {
    if (!name) return "";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  if (users.length === 0) {
    return (
      <div className="min-h-screen bg-[#22211f] flex items-center justify-center text-zinc-500">
        No rankings available at the moment.
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#22211f] text-white px-4 py-12 font-sans">

      <div className="max-w-4xl mx-auto">


        {}
        <div className="text-center mb-12">

          <div className="inline-block mb-3">
            <span className="
              px-4 py-1 rounded-full 
              border border-zinc-800 
              bg-zinc-900/40 
              text-zinc-400 
              text-5xl
              font-medium
              flex items-center justify-center gap-1.5
            ">
              🏆 Season Rankings
            </span>
          </div>


         


          <p className="mt-2 text-zinc-400 text-4xl">
            Compete. Grow. Climb the ranks.
          </p>

        </div>





        {}

        {topThree.length > 0 && (

          <div className="
            grid grid-cols-1 
            md:grid-cols-3 
            gap-4 
            mb-10
          ">


            {}

            {topThree[1] && (

              <div className="
                bg-[#2a2927]/30
                border border-zinc-800/80
                rounded-2xl
                p-6
                flex flex-col items-center
                order-2 md:order-1
              ">

                <span className="text-7xl mb-3">
                  🥈
                </span>


                <Image
                  src={topThree[1].avatar || "/man.png"}
                  alt={topThree[1].fullName}
                  width={64}
                  height={64}
                  className="
                    w-16 h-16
                    rounded-full
                    object-cover
                    mb-4
                    border border-zinc-700
                  "
                />


                <h3 className="font-bold text-zinc-100">
                  {topThree[1].fullName}
                </h3>


                <p className="text-xs text-green-400 mt-1">
                  {topThree[1].followersCount.toLocaleString()} followers
                </p>


                <span className="mt-4 text-2xl font-bold text-indigo-500">
                  #2
                </span>

              </div>

            )}






            {}


            {topThree[0] && (

              <div className="
                bg-[#2a2927]/30
                border border-zinc-700/50
                rounded-2xl
                p-8
                flex flex-col items-center
                order-1 md:order-2
                md:-translate-y-6
                shadow-lg shadow-amber-500/5
              ">

                <span className="text-7xl mb-3">
                  🥇
                </span>


                <Image
                  src={topThree[0].avatar || "/man.png"}
                  alt={topThree[0].fullName}
                  width={80}
                  height={80}
                  className="
                    w-20 h-20
                    rounded-full
                    object-cover
                    mb-4
                    border border-blue-500/30
                  "
                />


                <h2 className="text-lg font-bold">
                  {topThree[0].fullName}
                </h2>


                <p className="text-xs text-green-400 mt-1">
                  {topThree[0].followersCount.toLocaleString()} followers
                </p>


                <span className="mt-4 text-3xl font-bold text-yellow-300">
                  #1
                </span>


              </div>

            )}







            {}

            {topThree[2] && (

              <div className="
                bg-[#2a2927]/30
                border border-zinc-800/80
                rounded-2xl
                p-6
                flex flex-col items-center
                order-3 md:order-3
              ">


                <span className="text-7xl mb-3">
                  🥉
                </span>


                <Image
                  src={topThree[2].avatar || "/man.png"}
                  alt={topThree[2].fullName}
                  width={64}
                  height={64}
                  className="
                    w-16 h-16
                    rounded-full
                    object-cover
                    mb-4
                    border border-zinc-700
                  "
                />


                <h3 className="font-bold">
                  {topThree[2].fullName}
                </h3>


                <p className="text-xs text-green-400 mt-1">
                  {topThree[2].followersCount.toLocaleString()} followers
                </p>


                <span className="mt-4 text-2xl font-bold text-orange-400">
                  #3
                </span>


              </div>

            )}



          </div>

        )}





        <hr className="border-zinc-800/50 my-8" />





        {}

        <div className="flex flex-col gap-3">


          {remaining.map((user, index) => (

            <div
              key={user._id}
              className="
                flex items-center justify-between
                py-3.5 px-4
                bg-[#2a2927]/10
                border border-zinc-800/80
                hover:bg-[#2a2927]/20
                hover:border-zinc-700/60
                transition-all duration-200
                rounded-xl
              "
            >


              <div className="flex items-center gap-5">


                <span className="w-5 text-center text-zinc-500">
                  {index + 4}
                </span>



                <Image
                  src={user.avatar || "/man.png"}
                  alt={user.fullName}
                  width={40}
                  height={40}
                  className="
                    w-10 h-10
                    rounded-full
                    object-cover
                  "
                />



                <div>

                  <h4 className="font-semibold text-sm">
                    {user.fullName}
                  </h4>


                  <p className="text-xs text-zinc-500">
                    {user.role}
                  </p>


                </div>


              </div>




              <div className="text-right">

                <p className="font-bold text-green-400">
                  {user.followersCount.toLocaleString()}
                </p>

                <p className="text-[11px] text-zinc-500">
                  followers
                </p>

              </div>



            </div>


          ))}


        </div>


      </div>

    </div>
  );
};


export default Leaderboard;