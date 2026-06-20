'use client'
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import toast from "react-hot-toast";
import EditorLoader from "@/app/Animations/EditorLoader";
import LoadingAiConfig from "./loading-aiconfig";





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





const AIConfigDashboard = () => {
  const queryClient = useQueryClient();

  const [editedConfig, setEditedConfig] = useState<AIConfig | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  



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

  



  useEffect(() => {
    if (currentConfig) {
      setEditedConfig({ ...currentConfig });
    }
  }, [currentConfig]);

  



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

  



  if (configError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        {(configErrObj as Error)?.message || "Failed to load config"}
      </div>
    );
  }

  



  if (configLoading || !editedConfig) {
    return <LoadingAiConfig />;
  }

  



  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      <div className="mb-10 max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <div className="text-2xl font-bold tracking-tight text-black">Systems Config</div>
          <p className="text-zinc-650 text-xs font-bold tracking-wide mt-1.5">Dial in the operational parameters of your AI infrastructure.</p>
        </div>

        {(configFetching || historyFetching) && (
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-50 border text-zinc-850 text-xs font-bold tracking-wide rounded-lg"
            style={{ borderColor: "#e4e4e7" }}
          >
            <div className="w-3.5 h-3.5 border border-zinc-350 border-t-black rounded-full animate-spin"></div>
            Syncing State...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mb-12">
        <div 
          className="bg-zinc-50 rounded-xl border p-8 relative overflow-hidden group"
          style={{ borderColor: "#e4e4e7" }}
        >
          <div className="absolute top-0 right-0 p-8">
            <button
              disabled={disableAll}
              onClick={() =>
                setEditedConfig((prev: any) => ({
                  ...prev,
                  aiEnabled: !prev.aiEnabled,
                }))
              }
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${editedConfig.aiEnabled ? 'bg-black border border-black' : 'bg-zinc-200 border border-zinc-350'
                } ${disableAll ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full shadow-md transition duration-300 ease-in-out ${editedConfig.aiEnabled ? 'translate-x-7 bg-white' : 'translate-x-1 bg-zinc-550'
                  }`}
              />
            </button>
          </div>
          <div className="pr-20">
            <div 
              className="w-10 h-10 rounded-lg bg-white border text-black flex items-center justify-center mb-6"
              style={{ borderColor: "#e4e4e7" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-sm font-bold tracking-tight text-black mb-2">Master AI Toggle</div>
            <p className="text-zinc-550 font-semibold text-xs leading-relaxed">
              Enable or disable the entire AI infrastructure across the application instantly.
            </p>
            <div 
              className="mt-6 inline-flex px-3 py-1 rounded border text-[10px] font-bold tracking-wide bg-white text-zinc-700"
              style={{ borderColor: "#e4e4e7" }}
            >
              State: <span className={`ml-2 ${editedConfig.aiEnabled ? 'text-black' : 'text-zinc-500'}`}>{editedConfig.aiEnabled ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>

        {}
        <div 
          className="bg-zinc-50 rounded-xl border p-8"
          style={{ borderColor: "#e4e4e7" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div 
              className="w-10 h-10 rounded-lg bg-white border text-black flex items-center justify-center"
              style={{ borderColor: "#e4e4e7" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight text-black">{editedConfig.dailyappLimit}</div>
              <div className="text-[10px] font-bold tracking-wide text-zinc-500 mt-1">CAP/DAY</div>
            </div>
          </div>

          <div className="text-sm font-bold tracking-tight text-black mb-2">Global Quota</div>
          <p className="text-zinc-550 font-semibold text-xs mb-6">Maximum total AI completions allowed for the entire application per day.</p>

          <input
            disabled={disableAll}
            type="range"
            min="10"
            max="200"
            step="10"
            value={editedConfig.dailyappLimit ?? 10}
            onChange={(e) => setEditedConfig((prev: any) => ({ ...prev, dailyappLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none"
          />
        </div>

        {}
        <div 
          className="bg-zinc-50 rounded-xl border p-8"
          style={{ borderColor: "#e4e4e7" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div 
              className="w-10 h-10 rounded-lg bg-white border text-black flex items-center justify-center"
              style={{ borderColor: "#e4e4e7" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold tracking-tight text-black">{editedConfig.aiPerMinuteLimit ?? 1}</div>
              <div className="text-[10px] font-bold tracking-wide text-zinc-500 mt-1">REQS/MIN</div>
            </div>
          </div>

          <div className="text-sm font-bold tracking-tight text-black mb-2">Burst Resistance</div>
          <p className="text-zinc-550 font-semibold text-xs mb-6">Throttle rapid concurrent invocations to stabilize compute resources.</p>

          <input
            disabled={disableAll}
            type="range"
            min="1"
            max="20"
            step="1"
            value={editedConfig.aiPerMinuteLimit ?? 1}
            onChange={(e) => setEditedConfig((prev: any) => ({ ...prev, aiPerMinuteLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black focus:outline-none"
          />
        </div>
      </div>

      <div className="max-w-5xl mb-16">
        <button
          onClick={handleSave}
          disabled={isUnchanged || disableAll}
          className={`w-full py-4 rounded-lg text-xs font-bold tracking-wider transition-all relative flex items-center justify-center border ${isUnchanged || disableAll
              ? 'bg-zinc-100 text-zinc-450 border-zinc-200 cursor-not-allowed shadow-none'
              : 'bg-black border-black text-white hover:bg-zinc-800 hover:-translate-y-0.5'
            }`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-4 h-4"></div>
              <EditorLoader size={24} border={3} />
            </span>
          ) : (
            'Deploy Changes to Production'
          )}
        </button>
      </div>

      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="text-sm font-bold tracking-tight text-black">Config Mutability Log</div>

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
                {historyErrObj?.message || "Failed to reconstruct history."}
              </div>
            )}

            {!historyLoading && !historyError && configHistory.length === 0 ? (
              <div className="p-16 text-center text-zinc-600 text-xs font-bold tracking-wide bg-zinc-55">
                Config state is pristine. No commits recorded.
              </div>
            ) : (
              !historyLoading && !historyError && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px] table-auto">
                    <thead 
                      className="bg-zinc-50 border-b"
                      style={{ borderColor: "#e4e4e7" }}
                    >
                      <tr className="text-[10px] font-bold tracking-wide text-zinc-600">
                        <th className="px-6 py-4">Author</th>
                        <th className="px-6 py-4">Node Status</th>
                        <th className="px-6 py-4 w-[200px]">Engine</th>
                        <th className="px-6 py-4 text-center">Caps (U/A/M)</th>
                        <th className="px-6 py-4 text-right w-48">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: "#e4e4e7" }}>
                      {configHistory.map((item) => (
                        <tr key={item._id} className="hover:bg-zinc-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-black text-xs">{item.changedBy?.fullName || "—"}</p>
                            <p className="text-[10px] font-semibold text-zinc-500 tracking-wide mt-0.5">{item.changedBy?.email || "—"}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-2 py-1 rounded border text-[9px] font-bold tracking-wide uppercase ${item.configSnapshot?.aiEnabled ? "bg-black text-white border-black" : "bg-zinc-100 text-zinc-650 border-zinc-200"}`}>
                              {item.configSnapshot?.aiEnabled ? "ONLINE" : "HALTED"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-[10px] font-bold text-zinc-850 bg-white border px-2 py-1 rounded inline-block truncate max-w-full" style={{ borderColor: "#e4e4e7" }}>
                              {item.configSnapshot?.aiModel || "—"}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-1 justify-center">
                              <span className="bg-white border text-black text-[10px] font-bold px-2 py-1 rounded" style={{ borderColor: "#e4e4e7" }} title="User Limit">{item.configSnapshot?.dailyAiLimit}</span>
                              <span className="text-zinc-450 flex items-center">/</span>
                              <span className="bg-white border text-black text-[10px] font-bold px-2 py-1 rounded" style={{ borderColor: "#e4e4e7" }} title="App Limit">{item.configSnapshot?.dailyappLimit}</span>
                              <span className="text-zinc-450 flex items-center">/</span>
                              <span className="bg-white border text-black text-[10px] font-bold px-2 py-1 rounded" style={{ borderColor: "#e4e4e7" }} title="Per-Minute Limit">{item.configSnapshot?.aiPerMinuteLimit ?? '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right text-[10px] font-bold text-zinc-600 tracking-wide pt-5">
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