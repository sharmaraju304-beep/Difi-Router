"use client";

import { useLiveEvents } from "@/hooks/useLiveEvents";
import { Activity, ExternalLink, Filter } from "lucide-react";
import { STELLAR_CONFIG } from "@/lib/stellar/config";
import { useState } from "react";

export function ActivityFeedComponent() {
  const { activityFeed } = useLiveEvents();
  const [filterType, setFilterType] = useState<string>("ALL");

  const filtered = activityFeed.filter((evt) => {
    if (filterType === "ALL") return true;
    return evt.type === filterType;
  });

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "IntentSubmitted":
        return "bg-blue-950/80 text-blue-400 border-blue-800";
      case "RouteCalculated":
        return "bg-amber-950/80 text-amber-400 border-amber-800";
      case "SwapExecuted":
        return "bg-emerald-950/80 text-emerald-400 border-emerald-800";
      case "TransactionConfirmed":
        return "bg-purple-950/80 text-purple-400 border-purple-800";
      case "ExecutionFailed":
      case "IntentCancelled":
        return "bg-rose-950/80 text-rose-400 border-rose-800";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Live Soroban Event Activity</h3>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-zinc-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Events</option>
            <option value="IntentSubmitted">IntentSubmitted</option>
            <option value="RouteCalculated">RouteCalculated</option>
            <option value="SwapExecuted">SwapExecuted</option>
            <option value="TransactionConfirmed">TransactionConfirmed</option>
          </select>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-500 font-mono">No matching activity events found.</div>
        ) : (
          filtered.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start justify-between rounded border border-zinc-800/80 bg-zinc-900/40 p-3 text-xs transition hover:border-zinc-700"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`rounded border px-2 py-0.5 font-mono text-[10px] font-semibold ${getBadgeStyle(evt.type)}`}>
                    {evt.type}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    {evt.walletAddress.slice(0, 6)}...{evt.walletAddress.slice(-4)}
                  </span>
                </div>
                <p className="text-zinc-200">{evt.action}</p>
                {evt.intentId && <p className="font-mono text-[10px] text-zinc-500">Ref Intent: {evt.intentId}</p>}
              </div>

              <div className="text-right space-y-1 shrink-0 font-mono text-[11px]">
                <span className="text-zinc-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                <div>
                  <a
                    href={`${STELLAR_CONFIG.explorerBaseUrl}/contract/${STELLAR_CONFIG.contractId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                  >
                    <span>Contract</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
