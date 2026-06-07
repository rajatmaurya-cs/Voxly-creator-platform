"use client";

import React from "react";
import Moment from "react-moment";

import {
  HiOutlineCpuChip,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineBolt,
  HiOutlineClock,
} from "react-icons/hi2";

import {
  FiActivity,
  FiUser,
  FiShield,
} from "react-icons/fi";

import {
  MdOutlineAnalytics,
} from "react-icons/md";

type AIStatsData = {
  success: boolean;
  stats: {
    totalRequests: number;
    todayRequests: number;
    mostUsedAI: string;
    uniqueUsers: number;
    logs: any[];
  };
};

interface ClientProps {
  data: AIStatsData;
}

const Client = ({ data }: ClientProps) => {
  const { stats } = data;

  const cards = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toLocaleString(),
      icon:  <HiOutlineCpuChip size={20} />,
    },
    {
      title: "Today's Requests",
      value: stats.todayRequests.toLocaleString(),
      icon: <HiOutlineUsers size={20} />,
    },
    {
      title: "Most Used AI",
      value: stats.mostUsedAI,
      icon: <FiActivity size={20} />,
    },
    {
      title: "Unique Users",
      value: stats.uniqueUsers.toLocaleString(),
      icon: <HiOutlineChartBar size={20} />,
    },
  ];

  // return (
  //   <div className="w-full max-w-7xl px-6 py-10">
  //     {/* Header */}
  //     <div className="mb-10">
  //       <h1 className="text-4xl font-bold text-white">
  //         AI Usage Dashboard
  //       </h1>

  //       <p className="mt-2 text-gray-400">
  //         Monitor AI consumption, user engagement and platform activity.
  //       </p>
  //     </div>

  //     {/* Stats Cards */}
  //     <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
  //       {cards.map((card) => (
  //         <div
  //           key={card.title}
  //           className="
  //             group
  //             relative
  //             overflow-hidden
  //             rounded-3xl
  //             border
  //             border-white/10
  //             bg-gradient-to-b
  //             from-white/[0.08]
  //             to-white/[0.03]
  //             backdrop-blur-xl
  //             p-6
  //             transition-all
  //             duration-300
  //             hover:border-purple-500/30
  //             hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]
  //           "
  //         >
  //           <div className="flex items-center justify-between">
  //             <p className="text-sm font-medium text-gray-400">
  //               {card.title}
  //             </p>

  //             <span className="text-xl opacity-80">
  //               {card.icon}
  //             </span>
  //           </div>

  //           <h2 className="mt-4 text-3xl font-bold text-white break-words">
  //             {card.value}
  //           </h2>
  //         </div>
  //       ))}
  //     </div>

  //     {/* User Activity */}
  //     <div
  //       className="
  //         mt-10
  //         rounded-3xl
  //         border
  //         border-white/10
  //         bg-gradient-to-b
  //         from-white/[0.05]
  //         to-white/[0.02]
  //         backdrop-blur-xl
  //         p-6
  //       "
  //     >
  //       <div className="mb-6">
  //         <h2 className="text-2xl font-bold text-white">
  //           Recent AI Activity
  //         </h2>

  //         <p className="mt-1 text-sm text-gray-400">
  //           Track which users are utilizing AI features across the platform.
  //         </p>
  //       </div>

  //       {stats.logs.length === 0 ? (
  //         <div
  //           className="
  //             rounded-3xl
  //             border
  //             border-dashed
  //             border-white/10
  //             bg-white/[0.02]
  //             py-20
  //             text-center
  //           "
  //         >
  //           <div
  //             className="
  //               mx-auto
  //               mb-5
  //               flex
  //               h-16
  //               w-16
  //               items-center
  //               justify-center
  //               rounded-full
  //               bg-white/[0.05]
  //               text-2xl
  //             "
  //           >
  //             📊
  //           </div>

  //           <h3 className="text-xl font-semibold text-white">
  //             No AI Activity Yet
  //           </h3>

  //           <p className="mt-2 text-gray-400">
  //             Usage logs will appear here once users start using AI features.
  //           </p>
  //         </div>
  //       ) : (
  //         <div className="space-y-4">
  //           {stats.logs.map((log, index) => (
  //             <div
  //               key={log._id}
  //               className="
  //                 flex
  //                 flex-col
  //                 gap-4
  //                 rounded-2xl
  //                 border
  //                 border-white/10
  //                 bg-white/[0.03]
  //                 p-5
  //                 transition-all
  //                 duration-300
  //                 hover:bg-white/[0.05]
  //                 hover:border-purple-500/20
  //                 md:flex-row
  //                 md:items-center
  //                 md:justify-between
  //               "
  //             >
  //               {/* Left */}
  //               <div className="flex items-center gap-4">
  //                 <div
  //                   className="
  //                     flex
  //                     h-12
  //                     w-12
  //                     items-center
  //                     justify-center
  //                     rounded-full
  //                     bg-gradient-to-r
  //                     from-violet-500
  //                     to-fuchsia-500
  //                     text-lg
  //                     font-bold
  //                     text-white
  //                   "
  //                 >
  //                   {log.userId?.fullName
  //                     ? log.userId.fullName.charAt(0).toUpperCase()
  //                     : "?"}
  //                 </div>

  //                 <div>
  //                   <h3 className="font-semibold text-white">
  //                     {log.userId?.fullName || "Unknown User"}
  //                   </h3>

  //                   <p className="text-sm text-gray-400">
  //                     #{String(index + 1).padStart(3, "0")}
  //                   </p>
  //                 </div>
  //               </div>

  //               {/* Center */}
  //               <div className="flex flex-wrap items-center gap-3">
  //                 <span
  //                   className={`
  //                     inline-flex
  //                     rounded-xl
  //                     px-3
  //                     py-1.5
  //                     text-xs
  //                     font-semibold
  //                     uppercase
  //                     tracking-wider
  //                     ${
  //                       log.role === "admin"
  //                         ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
  //                         : "bg-slate-500/10 text-slate-300 border border-slate-500/20"
  //                     }
  //                   `}
  //                 >
  //                   {log.role}
  //                 </span>

  //                 <span
  //                   className="
  //                     inline-flex
  //                     items-center
  //                     rounded-xl
  //                     border
  //                     border-violet-500/20
  //                     bg-violet-500/10
  //                     px-3
  //                     py-1.5
  //                     text-xs
  //                     font-semibold
  //                     text-violet-300
  //                   "
  //                 >
  //                   {log.action}
  //                 </span>
  //               </div>

  //               {/* Right */}
  //               <div className="text-sm text-gray-400 md:text-right">
  //                 {log.createdAt ? (
  //                   <Moment format="MMM D, YYYY">
  //                     {log.createdAt}
  //                   </Moment>
  //                 ) : (
  //                   "—"
  //                 )}
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       )}
  //     </div>

  //     {/* Future Analytics Section */}
  //     <div
  //       className="
  //         mt-10
  //         rounded-3xl
  //         border
  //         border-white/10
  //         bg-gradient-to-b
  //         from-white/[0.05]
  //         to-white/[0.02]
  //         backdrop-blur-xl
  //         p-8
  //       "
  //     >
  //       <h2 className="text-2xl font-bold text-white">
  //         AI Analytics
  //       </h2>

  //       <p className="mt-2 text-gray-400">
  //         Daily trends, user-wise usage, AI model distribution,
  //         growth metrics and visual insights can be displayed here.
  //       </p>

  //       <div className="mt-8 flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10">
  //         <span className="text-gray-500">
  //           Charts & Insights Coming Soon
  //         </span>
  //       </div>
  //     </div>
  //   </div>
  // );

return (
  <div className="w-full max-w-7xl px-6 py-10">
    {/* Header */}
    <div className="mb-10">
      <h1 className="text-3xl font-semibold text-zinc-100">
        AI Usage Dashboard
      </h1>

      <p className="mt-2 text-sm text-zinc-400">
        Monitor AI requests, user engagement, and platform-wide activity.
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="
            rounded-2xl
            border
            border-zinc-800
            bg-zinc-950
            p-6
            transition-colors
            duration-200
            hover:border-zinc-700
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-400">
              {card.title}
            </p>

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-800
                bg-zinc-900
                text-zinc-400
              "
            >
              {card.icon}
            </div>
          </div>

          <h2 className="mt-5 text-3xl font-bold text-zinc-100">
            {card.value}
          </h2>
        </div>
      ))}
    </div>

    {/* Recent Activity */}
    <div
      className="
        mt-10
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-zinc-100">
          Recent AI Activity
        </h2>

        <p className="mt-1 text-sm text-zinc-400">
          View the latest AI actions performed across the platform.
        </p>
      </div>

      {stats.logs.length === 0 ? (
        <div
          className="
            rounded-2xl
            border
            border-dashed
            border-zinc-800
            py-20
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900
              text-zinc-400
            "
          >
            <HiOutlineClock size={28} />
          </div>

          <h3 className="text-lg font-semibold text-zinc-100">
            No AI Activity Yet
          </h3>

          <p className="mt-2 text-sm text-zinc-400">
            Activity logs will appear here once users start using AI features.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {stats.logs.map((log, index) => (
            <div
              key={log._id}
              className="
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-zinc-800
                bg-zinc-900/40
                p-5
                transition-colors
                duration-200
                hover:border-zinc-700
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-800
                    bg-zinc-900
                    text-zinc-300
                    font-semibold
                  "
                >
                  {log.userId?.fullName ? (
                    log.userId.fullName.charAt(0).toUpperCase()
                  ) : (
                    <FiUser size={16} />
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-zinc-100">
                    {log.userId?.fullName || "Unknown User"}
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Activity #{String(index + 1).padStart(3, "0")}
                  </p>
                </div>
              </div>

              {/* Center */}
              <div className="flex flex-wrap items-center gap-3">
                {log.role === "admin" ? (
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-amber-900/40
                      bg-amber-950/30
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-amber-300
                    "
                  >
                    <FiShield size={12} />
                    Admin
                  </span>
                ) : (
                  <span
                    className="
                      inline-flex
                      items-center
                      rounded-lg
                      border
                      border-zinc-800
                      bg-zinc-900
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-zinc-300
                    "
                  >
                    User
                  </span>
                )}

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    border
                    border-zinc-800
                    bg-zinc-900
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-zinc-300
                  "
                >
                  <HiOutlineBolt size={12} />
                  {log.action}
                </span>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <FiActivity size={14} />

                {log.createdAt ? (
                  <Moment format="MMM D, YYYY">
                    {log.createdAt}
                  </Moment>
                ) : (
                  "—"
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Analytics Section */}
    <div
      className="
        mt-10
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-950
        p-6
      "
    >
      <div className="flex items-center gap-3">
        <MdOutlineAnalytics
          size={24}
          className="text-zinc-400"
        />

        <h2 className="text-xl font-semibold text-zinc-100">
          AI Analytics
        </h2>
      </div>

      <p className="mt-2 text-sm text-zinc-400">
        Daily trends, user-wise activity, model usage statistics,
        growth metrics, and AI insights can be displayed here.
      </p>

      <div
        className="
          mt-8
          flex
          h-64
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-zinc-800
        "
      >
        <MdOutlineAnalytics
          size={42}
          className="text-zinc-600"
        />

        <p className="mt-4 text-sm text-zinc-500">
          Charts and analytics modules coming soon.
        </p>
      </div>
    </div>
  </div>
);

};

export default Client;