"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import PlansConfigSkeleton from "./loading-skeleton";
import { Sparkles, Sliders, ClipboardList, Settings, HelpCircle, Save } from "lucide-react";

type Plan = {
  _id: string;
  name: string;
  price: number;
  limits: {
    aiGeneration: number;
    aiSummarizer: number;
  };
};

type PlanHistoryItem = {
  _id: string;
  configSnapshot: Plan;
  changedBy?: {
    fullName?: string;
    email?: string;
  };
  createdAt: string;
  changeReason?: string;
};

// ---------------- API FUNCTIONS ----------------

async function getPlans(): Promise<Plan[]> {
  const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/plan/getplans`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  const result = await res.json();
  return result.data || [];
}

async function getPlanHistory(): Promise<PlanHistoryItem[]> {
  const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/plan/getplanhistory`);
  if (!res.ok) throw new Error("Failed to fetch plan history");
  const result = await res.json();
  return result.history || [];
}

async function updatePlan(data: Plan) {
  const res = await apiFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/plan/updateplan/${data._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        price: data.price,
        limits: data.limits,
      }),
    }
  );
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

const getPlanTheme = (name: string) => {
  switch (name?.toLowerCase()) {
    case "free":
      return {
        badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
        activeBorder: "border-zinc-950 ring-zinc-950/5",
        iconColor: "text-zinc-400",
      };
    case "plus":
      return {
        badgeBg: "bg-blue-50/70 text-blue-700 border-blue-100",
        activeBorder: "border-blue-500 ring-blue-500/10",
        iconColor: "text-blue-500",
      };
    case "pro":
      return {
        badgeBg: "bg-violet-50/70 text-violet-700 border-violet-100",
        activeBorder: "border-violet-500 ring-violet-500/10",
        iconColor: "text-violet-500",
      };
    default:
      return {
        badgeBg: "bg-zinc-100 text-zinc-700 border-zinc-200",
        activeBorder: "border-zinc-900 ring-zinc-900/5",
        iconColor: "text-zinc-500",
      };
  }
};

export default function AdminPlans() {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const { data: plans, isLoading: plansLoading, isError } = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: getPlans,
  }) as { data: Plan[] | undefined; isLoading: boolean; isError: boolean };

  const {
    data: planHistory = [],
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrObj,
  } = useQuery<PlanHistoryItem[]>({
    queryKey: ["plan-history"],
    queryFn: getPlanHistory,
    enabled: !plansLoading,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      toast.success("Plan updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["plan-history"],
      });
      setSelectedPlan(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update plan");
    },
  });

  if (plansLoading) {
    return <PlansConfigSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-red-500 font-semibold">
        Error loading plans. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-350">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-zinc-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Manage Plans</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Configure pricing tiers and subscription usage limits for AI features.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section: Plan Cards (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select a Plan to edit</h2>
            <span className="text-xs text-zinc-400 font-semibold">{plans?.length || 0} Tiers Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plans?.map((plan) => {
              const isSelected = selectedPlan?._id === plan._id;
              const theme = getPlanTheme(plan.name);
              return (
                <button
                  key={plan._id}
                  onClick={() => {
                    setSelectedPlan({
                      ...plan,
                      limits: { ...plan.limits },
                    });
                  }}
                  className={`relative p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-56 bg-white ${
                    isSelected
                      ? "border-zinc-950 ring-4 ring-zinc-950/5 shadow-md -translate-y-0.5"
                      : "border-zinc-200 hover:border-zinc-350 hover:shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-4 right-4 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-900 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900"></span>
                    </span>
                  )}

                  <div className="space-y-4 w-full">
                    <div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${theme.badgeBg}`}>
                        {plan.name}
                      </span>
                    </div>

                    <div>
                      <span className="text-3xl  text-zinc-900">₹{plan.price}</span>
                      <span className="text-zinc-500 text-xs font-semibold">/mo</span>
                    </div>

                    <div className="border-t border-zinc-100 my-1 w-full" />

                    <div className="space-y-2 text-zinc-650 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Gen: <strong className="text-zinc-900">{plan.limits.aiGeneration}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Sum: <strong className="text-zinc-900">{plan.limits.aiSummarizer}</strong></span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Edit Form / Selection Prompt (Col span 1) */}
        <div className="lg:col-span-1">
          {selectedPlan ? (
            <div className="border border-zinc-250 rounded-2xl p-6 bg-white shadow-sm space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                    Edit {selectedPlan.name} Plan
                  </h2>
                  <p className="text-zinc-500 text-xs mt-0.5">Update pricing and feature allocations.</p>
                </div>
                <Settings className="w-4 h-4 text-zinc-400" />
              </div>

              <div className="space-y-4">
                {/* Price input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide flex items-center justify-between">
                    <span>Price (USD / mo)</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Required</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-zinc-400 text-sm font-semibold">₹</span>
                    </div>
                    <input
                      type="number"
                      value={selectedPlan.price}
                      onChange={(e) => {
                        setSelectedPlan((prev) => {
                          if (!prev) return null;
                          return {
                            ...prev,
                            price: Number(e.target.value),
                          };
                        });
                      }}
                      className="block w-full pl-7 pr-3 py-2 border border-zinc-250 rounded-lg text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* AI Generation limit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>AI Generation Limit</span>
                  </label>
                  <input
                    type="number"
                    value={selectedPlan.limits.aiGeneration}
                    onChange={(e) => {
                      setSelectedPlan((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          limits: {
                            ...prev.limits,
                            aiGeneration: Number(e.target.value),
                          },
                        };
                      });
                    }}
                    className="block w-full px-3 py-2 border border-zinc-250 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* AI Summarizer limit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    <span>AI Summarizer Limit</span>
                  </label>
                  <input
                    type="number"
                    value={selectedPlan.limits.aiSummarizer}
                    onChange={(e) => {
                      setSelectedPlan((prev) => {
                        if (!prev) return null;
                        return {
                          ...prev,
                          limits: {
                            ...prev.limits,
                            aiSummarizer: Number(e.target.value),
                          },
                        };
                      });
                    }}
                    className="block w-full px-3 py-2 border border-zinc-250 rounded-lg text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="flex-1 border border-zinc-250 py-2.5 rounded-lg text-xs font-bold hover:bg-zinc-50 transition text-zinc-700"
                >
                  Cancel
                </button>
                <button
                  disabled={mutation.isPending}
                  onClick={() => {
                    if (selectedPlan) mutation.mutate(selectedPlan);
                  }}
                  className="flex-1 bg-zinc-950 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-zinc-900 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col items-center justify-center text-center h-56">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center mb-3 text-zinc-400 border border-zinc-200">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xs font-bold text-zinc-800">No Plan Selected</h3>
              <p className="text-zinc-500 text-[11px] mt-1 max-w-[200px] leading-relaxed">
                Select one of the pricing plans on the left to modify its parameters and usage quotas.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Config Mutability Log */}
      <div className="border-t border-zinc-200 pt-8 mt-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-zinc-550" />
              Plans Mutability Log
            </h3>
            <p className="text-zinc-500 text-xs mt-0.5">Audit trail of changes made to pricing plans.</p>
          </div>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border text-zinc-850 text-xs font-bold tracking-wide hover:bg-zinc-100 transition-all shadow-sm"
            style={{ borderColor: "#e4e4e7" }}
          >
            <svg className={`w-3.5 h-3.5 text-zinc-550 group-hover:text-black transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showHistory ? "Collapse Logs" : "Expand Logs"}
          </button>
        </div>

        {showHistory && (
          <div 
            className="bg-white rounded-xl border overflow-hidden relative animate-in slide-in-from-top-4 duration-300"
            style={{ borderColor: "#e4e4e7" }}
          >
            {historyLoading && (
              <div className="p-16 text-center bg-zinc-50">
                <div className="w-8 h-8 border border-zinc-350 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-zinc-550 text-xs font-bold tracking-wide">Retrieving audits...</p>
              </div>
            )}

            {historyError && (
              <div className="p-10 text-center bg-red-50/10 text-red-700 border border-red-200 rounded-xl font-bold text-xs tracking-wide">
                {(historyErrObj as Error)?.message || "Failed to reconstruct history."}
              </div>
            )}

            {!historyLoading && !historyError && planHistory.length === 0 ? (
              <div className="p-16 text-center text-zinc-500 text-xs font-bold tracking-wide bg-zinc-50">
                Plan history is pristine. No commits recorded.
              </div>
            ) : (
              !historyLoading && !historyError && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px] table-auto">
                    <thead className="bg-zinc-50 border-b" style={{ borderColor: "#e4e4e7" }}>
                      <tr className="text-[10px] font-bold tracking-wide text-zinc-600">
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4">Plan</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-center">Limits (Gen / Sum)</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4 text-right w-48">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "#e4e4e7" }}>
                      {planHistory.map((item) => {
                        const theme = getPlanTheme(item.configSnapshot?.name);
                        return (
                          <tr key={item._id} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-black text-xs">{item.changedBy?.fullName || "—"}</p>
                              <p className="text-[10px] font-semibold text-zinc-500 tracking-wide mt-0.5">{item.changedBy?.email || "—"}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-0.5 rounded border text-[9px] font-bold tracking-wide uppercase ${theme.badgeBg}`}>
                                {item.configSnapshot?.name || "—"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs font-semibold text-zinc-800">${item.configSnapshot?.price || 0}/mo</p>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex gap-1.5 justify-center">
                                <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded" style={{ borderColor: "#e4e4e7" }} title="AI Gen Limit">
                                  <Sparkles className="w-2.5 h-2.5 text-zinc-400" />
                                  {item.configSnapshot?.limits?.aiGeneration}
                                </span>
                                <span className="text-zinc-300 flex items-center">/</span>
                                <span className="inline-flex items-center gap-1 bg-white border border-zinc-200 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded" style={{ borderColor: "#e4e4e7" }} title="AI Summarizer Limit">
                                  <Sliders className="w-2.5 h-2.5 text-zinc-400" />
                                  {item.configSnapshot?.limits?.aiSummarizer}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-xs text-zinc-650 max-w-xs truncate" title={item.changeReason}>
                                {item.changeReason || "—"}
                              </p>
                            </td>
                            <td className="px-6 py-4 text-right text-[10px] font-bold text-zinc-500 tracking-wide">
                              {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}