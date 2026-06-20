"use client";

import React from "react";
import Moment from "react-moment";
import Image from "next/image";

import {
  HiOutlineCpuChip,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineClock,
} from "react-icons/hi2";

import {
  FiActivity,
  FiShield,
  FiBox,
  FiAlertTriangle,
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
      icon: <HiOutlineCpuChip size={22} />,
    },
    {
      title: "Today's Requests",
      value: stats.todayRequests.toLocaleString(),
      icon: <HiOutlineUsers size={22} />,
    },
    {
      title: "Most Used AI",
      value: stats.mostUsedAI,
      icon: <FiActivity size={22} />,
    },
    {
      title: "Unique Users",
      value: stats.uniqueUsers.toLocaleString(),
      icon: <HiOutlineChartBar size={22} />,
    },
  ];


  return (
    <div className="w-full max-w-5xl py-4 animate-in fade-in duration-500">
      {}
      <div className="mb-8 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-800 backdrop-blur-sm">
        <FiAlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div className="text-xs font-semibold tracking-wide">
          Superadmin is only for demonstration. Any action is prohibited.
        </div>
      </div>

      {}
      <div className="mb-10">
        <div className="text-2xl font-bold tracking-tight text-black">
          AI Usage Dashboard
        </div>
        <p className="mt-1.5 text-xs text-zinc-650 font-bold tracking-wide">
          Track AI generation, user activity and platform usage insights across Postify.
        </p>
      </div>

      {}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-zinc-50 p-6 transition-all duration-300 hover:border-zinc-400"
            style={{ borderColor: "#e4e4e7" }}
          >
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wide text-zinc-700">{card.title}</p>
              <div 
                className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-zinc-850 transition-colors duration-300 group-hover:text-black group-hover:border-zinc-400"
                style={{ borderColor: "#e4e4e7" }}
              >
                {card.icon}
              </div>
            </div>
            <div className="mt-6 text-3xl font-bold text-black tracking-tight truncate">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {}
      <div 
        className="mt-8 overflow-hidden rounded-xl border bg-white"
        style={{ borderColor: "#e4e4e7" }}
      >
        <div 
          className="flex items-center justify-between border-b p-6"
          style={{ borderColor: "#e4e4e7" }}
        >
          <div>
            <div className="text-sm font-bold tracking-tight text-black">
              Recent Activity
            </div>
            <p className="mt-1 text-xs font-semibold text-zinc-500">
              Latest AI actions performed by users.
            </p>
          </div>
          <FiActivity className="text-black" size={18} />
        </div>

        {stats.logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50">
            <div 
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border bg-white text-zinc-400"
              style={{ borderColor: "#e4e4e7" }}
            >
              <HiOutlineClock size={20} />
            </div>
            <div className="text-xs font-bold tracking-wide text-zinc-800">No Activity Yet</div>
            <p className="mt-2 text-xs text-zinc-500 font-semibold max-w-xs tracking-wide">
              User AI activity will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {stats.logs.map((log, index) => (
              <div
                key={log._id || index}
                className="group flex flex-col gap-5 border-b p-6 transition hover:bg-zinc-50 md:flex-row md:items-center md:justify-between last:border-none"
                style={{ borderColor: "#e4e4e7" }}
              >
                {}
                <div className="flex items-center gap-4">
                  <div 
                    className="relative flex h-10 w-10 overflow-hidden rounded-lg border bg-zinc-50"
                    style={{ borderColor: "#e4e4e7" }}
                  >
                    <Image
                      src="/user.png"
                      fill
                      alt=""
                      className="object-cover grayscale"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black tracking-tight">
                      {log.userId?.fullName || "Unknown User"}
                    </div>
                    <div className="mt-0.5 text-[9px] font-bold text-zinc-450 tracking-wide">
                      Activity #{index + 1}
                    </div>
                  </div>
                </div>

                {}
                <div className="flex flex-wrap gap-3">
                  {log.role === "admin" ? (
                    <span 
                      className="flex items-center gap-1.5 rounded border bg-black px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-white uppercase"
                      style={{ borderColor: "#000000" }}
                    >
                      <FiShield size={10} /> {log.role}
                    </span>
                  ) : (
                    <span 
                      className="flex items-center gap-1.5 rounded border bg-zinc-100 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-zinc-850"
                      style={{ borderColor: "#e4e4e7" }}
                    >
                      <FiBox size={10} /> {log.role}
                    </span>
                  )}

                  <span 
                    className="flex items-center gap-1.5 rounded border bg-zinc-100 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-zinc-850"
                    style={{ borderColor: "#e4e4e7" }}
                  >
                    <HiOutlineCpuChip size={10} /> {log.action}
                  </span>
                </div>

                {}
                <div className="text-[10px] text-zinc-600 font-bold tracking-wide">
                  {log.createdAt && (
                    <Moment format="MMM DD, YYYY">
                      {log.createdAt}
                    </Moment>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <div 
        className="mt-8 overflow-hidden rounded-xl border bg-white p-6 mb-10"
        style={{ borderColor: "#e4e4e7" }}
      >
        <div className="flex gap-4 items-center">
          <div 
            className="flex h-9 w-9 items-center justify-center rounded-lg border bg-zinc-50 text-zinc-850"
            style={{ borderColor: "#e4e4e7" }}
          >
            <MdOutlineAnalytics size={16} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-black">
              Analytics Overview
            </div>
            <p className="mt-0.5 text-xs font-semibold text-zinc-500">
              AI growth and usage trends.
            </p>
          </div>
        </div>

        <div 
          className="mt-6 flex h-48 flex-col items-center justify-center rounded-lg border border-dashed bg-zinc-50/50"
          style={{ borderColor: "#d4d4d8" }}
        >
          <MdOutlineAnalytics size={24} className="text-zinc-400" />
          <p className="mt-3 text-xs font-bold tracking-wide text-zinc-550">
            Charts coming soon
          </p>
        </div>
      </div>
    </div>
  );
};

export default Client;