'use client'
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import EditorLoader from "@/app/Animations/EditorLoader";
/* =========================
   TYPES
========================= */

type AIConfig = {
  aiEnabled: boolean;
  aiModel: string;
  dailyAiLimit: number;
  dailyappLimit: number;
  aiPerMinuteLimit: number;
};

type ConfigHistoryItem = {
  _id: string;
  configSnapshot: AIConfig;
  changedBy?: {
    fullName?: string;
    email?: string;
  };
  createdAt: string;
};

type APIResponse<T> = {
  success: boolean;
  message?: string;
  config?: T;
  history?: ConfigHistoryItem[];
};

/* =========================
   COMPONENT
========================= */

const AIConfigDashboard = () => {
  const queryClient = useQueryClient();

  const [editedConfig, setEditedConfig] = useState<AIConfig | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  /* =========================
     FETCH CONFIG
  ========================= */

  const fetchAIConfig = async (): Promise<AIConfig> => {
    const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/config/config-dashboard`, {
      method: "GET",
    });

    const data: APIResponse<AIConfig> = await res.json();

    if (!data?.config) {
      throw new Error(data?.message || "Failed to load AI config");
    }

    return data.config;
  };

  const {
    data: currentConfig,
    isLoading: configLoading,
    isError: configError,
    error: configErrObj,
    isFetching: configFetching,
  } = useQuery<AIConfig>({
    queryKey: ["ai-config"],
    queryFn: fetchAIConfig,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /* =========================
     FETCH HISTORY
  ========================= */

  const fetchAIConfigHistory = async (): Promise<ConfigHistoryItem[]> => {
    const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/config/getConfigHistory`, {
      method: "GET",
    });

    const data: APIResponse<AIConfig> = await res.json();

    if (!data?.success) {
      throw new Error(data?.message || "Failed to load config history");
    }

    return data.history || [];
  };

  const {
    data: configHistory = [],
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrObj,
    isFetching: historyFetching,
  } = useQuery<ConfigHistoryItem[]>({
    queryKey: ["ai-config-history"],
    queryFn: fetchAIConfigHistory,
    enabled: !!currentConfig,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  /* =========================
     INIT STATE
  ========================= */

  useEffect(() => {
    if (currentConfig) {
      setEditedConfig({ ...currentConfig });
    }
  }, [currentConfig]);

  /* =========================
     MUTATION
  ========================= */

  const updateMutation = useMutation<
    APIResponse<AIConfig>,
    Error,
    Partial<AIConfig>
  >({
    mutationFn: async (payload) => {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/config/updateConfig`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: APIResponse<AIConfig> = await res.json();

      if (!data?.success) {
        throw new Error(data?.message || "Update failed");
      }

      return data;
    },

    onMutate: () => toast.loading("Saving config...", { id: "save-config" }),

    onSuccess: () => {
      toast.success("Configuration updated", { id: "save-config" });

      queryClient.invalidateQueries({ queryKey: ["ai-config"] });
      queryClient.invalidateQueries({ queryKey: ["ai-config-history"] });
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update.";

      toast.error(message, { id: "save-config" });
    },
  });

  const saving = updateMutation.isPending;

  const isUnchanged =
    JSON.stringify(editedConfig) === JSON.stringify(currentConfig);

  const disableAll = saving || configFetching || historyFetching;

  /* =========================
     SAVE HANDLER
  ========================= */

  const handleSave = () => {
    if (!editedConfig) return;

    const payload: Partial<AIConfig> = {
      aiEnabled: editedConfig.aiEnabled,
      dailyAiLimit: editedConfig.dailyAiLimit,
      dailyappLimit: editedConfig.dailyappLimit,
      aiPerMinuteLimit: editedConfig.aiPerMinuteLimit,
    };

    updateMutation.mutate(payload);
  };

  /* =========================
     LOADING STATE
  ========================= */

  if (configLoading || !editedConfig) {
    return (
      <div className="p-4 sm:p-8 skeleton-fade">
        <div className="h-8 w-64 rounded-md animate-shimmer mb-3" />
        <div className="h-4 w-96 rounded-md animate-shimmer" />
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */

  if (configError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        {(configErrObj as Error)?.message || "Failed to load config"}
      </div>
    );
  }

  /* =========================
     UI (UNCHANGED)
  ========================= */

  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      <div className="mb-10 max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Systems Config</h1>
          <p className="text-slate-400 font-medium tracking-wide">Dial in the operational parameters of your AI infrastructure.</p>
        </div>

        {(configFetching || historyFetching) && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-indigo-400 text-sm font-bold tracking-wide rounded-2xl">
            <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            Syncing State...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mb-12">


        <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-[2rem] border border-white/10 p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <button
              disabled={disableAll}
              onClick={() =>
                setEditedConfig((prev) => ({
                  ...prev,
                  aiEnabled: !prev.aiEnabled,
                }))
              }
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${editedConfig.aiEnabled ? 'bg-emerald-500' : 'bg-white/10'
                } ${disableAll ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${editedConfig.aiEnabled ? 'translate-x-9' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>
          <div className="pr-20">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Master AI Toggle</h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed">
              Enable or disable the entire AI infrastructure across the application instantly.
            </p>
            <div className="mt-6 inline-flex px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase bg-white/5 text-slate-400">
              State: <span className={`ml-2 ${editedConfig.aiEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>{editedConfig.aiEnabled ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>

        {/* Global Rate Limit */}
        <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-[2rem] border border-white/10 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black tracking-tight text-blue-400">{editedConfig.dailyappLimit}</p>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">CAP/DAY</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Global Quota</h2>
          <p className="text-slate-400 font-medium text-sm mb-6">Maximum total AI completions allowed for the entire application per day.</p>

          <input
            disabled={disableAll}
            type="range"
            min="10"
            max="200"
            step="10"
            value={editedConfig.dailyappLimit ?? 10}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, dailyappLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Individual Daily Limit */}
        {/* <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-[2rem] border border-white/10 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black tracking-tight text-purple-400">{editedConfig.dailyAiLimit}</p>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">CAP/USER/DAY</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">User Daily Quota</h2>
          <p className="text-slate-400 font-medium text-sm mb-6">Individual consumption constraints over a 24-hour rolling period.</p>

          <input
            disabled={disableAll}
            type="range"
            min="1"
            max="10"
            step="1"
            value={editedConfig.dailyAiLimit ?? 1}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, dailyAiLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div> */}

        {/* Per-Minute Limit */}
        <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-[2rem] border border-white/10 p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black tracking-tight text-emerald-400">{editedConfig.aiPerMinuteLimit ?? 1}</p>
              <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mt-1">REQS/MIN</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Burst Resistance</h2>
          <p className="text-slate-400 font-medium text-sm mb-6">Throttle rapid concurrent invocations to stabilize compute resources.</p>

          <input
            disabled={disableAll}
            type="range"
            min="1"
            max="20"
            step="1"
            value={editedConfig.aiPerMinuteLimit ?? 1}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, aiPerMinuteLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

    

      </div>

      <div className="max-w-5xl mb-16">

        <button
          onClick={handleSave}
          disabled={isUnchanged || disableAll}
          className={`w-full py-5 rounded-[2rem] text-lg font-bold tracking-wide transition-all uppercase relative flex items-center justify-center ${isUnchanged || disableAll
              ? 'bg-white/5 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-[0_8px_30px_rgba(99,102,241,0.2)] hover:-translate-y-1'
            }`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              <EditorLoader size={30} border={3.5} />
            </span>
          ) : (
            'Deploy Changes to Production'
            
          )}
        </button>

      </div>

      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">Config Mutability Log</h2>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-bold tracking-wide hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
          >
            <svg className={`w-4 h-4 text-gray-400 group-hover:text-white transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showHistory ? "Collapse Logs" : "Expand Logs"}
          </button>
        </div>

        {showHistory && (
          <div className="bg-[#0b0f19]/40 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden relative animate-in slide-in-from-top-4 duration-300">
            {historyLoading && (
              <div className="p-16 text-center">
                <div className="w-10 h-10 border-4 border-white/10 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-bold tracking-wide">Retrieving audits...</p>
              </div>
            )}

            {historyError && (
              <div className="p-10 text-center bg-red-500/10 text-red-400 border border-red-500/20 rounded-[2rem] font-semibold">
                {historyErrObj?.message || "Failed to reconstruct history."}
              </div>
            )}

            {!historyLoading && !historyError && configHistory.length === 0 ? (
              <div className="p-16 text-center text-slate-500 font-bold tracking-wide">
                Config state is pristine. No commits recorded.
              </div>
            ) : (
              !historyLoading && !historyError && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px] table-auto">
                    <thead className="bg-white/[0.02] border-b border-white/5">
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <th className="px-6 py-5">Author</th>
                        <th className="px-6 py-5">Node Status</th>
                        <th className="px-6 py-5 w-[200px]">Engine</th>
                        <th className="px-6 py-5 text-center">Caps (U/A/M)</th>
                        <th className="px-6 py-5 text-right w-48">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {configHistory.map((item) => (
                        <tr key={item._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-bold text-white">{item.changedBy?.fullName || "—"}</p>
                            <p className="text-xs font-semibold text-slate-400 mt-0.5">{item.changedBy?.email || "—"}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${item.configSnapshot?.aiEnabled ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                              {item.configSnapshot?.aiEnabled ? "ONLINE" : "HALTED"}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-bold text-slate-300 bg-white/5 px-2 py-1 rounded inline-block truncate max-w-full">
                              {item.configSnapshot?.aiModel || "—"}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex gap-1 justify-center">
                              <span className="bg-purple-500/10 text-purple-400 text-xs font-bold px-2 py-1 rounded" title="User Limit">{item.configSnapshot?.dailyAiLimit}</span>
                              <span className="text-slate-600">/</span>
                              <span className="bg-blue-500/10 text-blue-400 text-xs font-bold px-2 py-1 rounded" title="App Limit">{item.configSnapshot?.dailyappLimit}</span>
                              <span className="text-slate-600">/</span>
                              <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded" title="Per-Minute Limit">{item.configSnapshot?.aiPerMinuteLimit ?? '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right text-xs font-bold text-slate-400 tracking-wide pt-6">
                            {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                          </td>
                        </tr>
                      ))}
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
};

export default AIConfigDashboard;