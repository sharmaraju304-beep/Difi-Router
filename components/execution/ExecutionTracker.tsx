"use client";

import { useIntentEngine } from "@/hooks/useIntentEngine";
import { STELLAR_CONFIG } from "@/lib/stellar/config";
import { CheckCircle2, Clock, Cpu, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import { IntentStatus } from "@/types/intent";

export function ExecutionTracker() {
  const { activeIntent, cancelIntent } = useIntentEngine();

  if (!activeIntent) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center text-xs text-zinc-500">
        No active execution tracking found. Submit an intent to view live execution details.
      </div>
    );
  }

  const steps: { status: IntentStatus; label: string; desc: string }[] = [
    { status: "pending", label: "Intent Registered", desc: "Intent validated & saved on Soroban ledger" },
    { status: "executing", label: "Route Calculated & Routing", desc: "Aggregated path verified across DEX pools" },
    { status: "confirmed", label: "Swap Executed & Confirmed", desc: "Tokens transferred & ledger finalized" },
  ];

  const getStepState = (stepStatus: IntentStatus) => {
    if (activeIntent.status === "failed") return "failed";
    if (activeIntent.status === "cancelled") return "cancelled";
    if (activeIntent.status === "confirmed") return "completed";
    if (activeIntent.status === "executing") {
      if (stepStatus === "pending" || stepStatus === "executing") return "completed";
      return "upcoming";
    }
    if (activeIntent.status === "pending") {
      if (stepStatus === "pending") return "current";
      return "upcoming";
    }
    return "upcoming";
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-zinc-300">ID: {activeIntent.id}</span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase font-semibold ${
                activeIntent.status === "confirmed"
                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                  : activeIntent.status === "executing"
                  ? "bg-amber-950/80 text-amber-400 border border-amber-800 animate-pulse"
                  : activeIntent.status === "pending"
                  ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {activeIntent.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {activeIntent.amountIn} {activeIntent.tokenIn.code} → {activeIntent.tokenOut.code}
          </p>
        </div>

        {activeIntent.status === "pending" && (
          <button
            onClick={() => cancelIntent(activeIntent.id)}
            className="rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-rose-400 hover:bg-zinc-800 hover:text-rose-300 transition"
          >
            Cancel Intent
          </button>
        )}
      </div>

      {/* Contract Verification Banner */}
      <div className="mb-4 flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-xs font-mono">
        <span className="text-zinc-400">Deployed Soroban Contract:</span>
        <a
          href={`${STELLAR_CONFIG.explorerBaseUrl}/contract/${STELLAR_CONFIG.contractId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition"
        >
          <span>{STELLAR_CONFIG.contractId.slice(0, 6)}...{STELLAR_CONFIG.contractId.slice(-6)}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-4 my-6">
        {steps.map((step, idx) => {
          const state = getStepState(step.status);
          return (
            <div key={idx} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-mono font-bold transition ${
                    state === "completed"
                      ? "bg-emerald-500 text-zinc-950"
                      : state === "current"
                      ? "bg-amber-500 text-zinc-950 animate-pulse"
                      : "bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {state === "completed" ? "✓" : idx + 1}
                </div>
                {idx < steps.length - 1 && <div className="h-8 w-0.5 bg-zinc-800 my-1" />}
              </div>

              <div className="pt-0.5">
                <p className={`text-xs font-semibold ${state === "upcoming" ? "text-zinc-500" : "text-zinc-200"}`}>
                  {step.label}
                </p>
                <p className="text-[11px] text-zinc-500">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Results Summary */}
      <div className="rounded border border-zinc-800 bg-zinc-900/40 p-4 space-y-2 text-xs font-mono">
        <div className="flex justify-between text-zinc-400">
          <span>Target Minimum Received:</span>
          <span className="text-zinc-200">
            {activeIntent.minAmountOut} {activeIntent.tokenOut.code}
          </span>
        </div>
        {activeIntent.executedAmountOut && (
          <div className="flex justify-between text-zinc-400">
            <span>Actual Received Amount:</span>
            <span className="text-emerald-400 font-semibold font-mono">
              {activeIntent.executedAmountOut} {activeIntent.tokenOut.code}
            </span>
          </div>
        )}
        <div className="flex justify-between items-center text-zinc-400 pt-2 border-t border-zinc-800">
          <span>Ledger Contract Explorer:</span>
          <a
            href={`${STELLAR_CONFIG.explorerBaseUrl}/contract/${STELLAR_CONFIG.contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition font-semibold"
          >
            <span>View Deployed Contract</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
