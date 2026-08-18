"use client";

import { useState } from "react";
import { useIntentEngine } from "@/hooks/useIntentEngine";
import { useWallet } from "@/hooks/useWallet";
import { SUPPORTED_TOKENS } from "@/lib/stellar/config";
import { ExecutionType, TokenInfo } from "@/types/intent";
import { ArrowDownUp, Shield, Zap, Percent, Layers, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function IntentForm() {
  const router = useRouter();
  const { isConnected, setModalOpen } = useWallet();
  const {
    tokenIn,
    tokenOut,
    amountIn,
    maxSlippageBps,
    executionType,
    deadlineMinutes,
    calculatedRoute,
    isCalculatingRoute,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setMaxSlippageBps,
    setExecutionType,
    setDeadlineMinutes,
    handleSubmit,
  } = useIntentEngine();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const swapTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!isConnected) {
      setModalOpen(true);
      return;
    }
    if (!amountIn || parseFloat(amountIn) <= 0) {
      setErrorMsg("Please enter a valid input amount.");
      return;
    }

    try {
      setIsSubmitting(true);
      const intentId = await handleSubmit();
      setIsSubmitting(false);
      router.push(`/execution?id=${intentId}`);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || "Failed to submit intent to Soroban contract.");
    }
  };

  const strategies: { type: ExecutionType; title: string; desc: string; icon: any }[] = [
    {
      type: "best_price",
      title: "Best Price",
      desc: "Aggregates Soroswap & Phoenix for max yield",
      icon: Zap,
    },
    {
      type: "low_fee",
      title: "Lowest Fee",
      desc: "Routes directly via Stellar SDEX 0.05%",
      icon: Percent,
    },
    {
      type: "mev_protected",
      title: "MEV Protected",
      desc: "Batch sequencing to block front-running",
      icon: Shield,
    },
    {
      type: "multi_hop",
      title: "Multi-Hop",
      desc: "Routes via intermediary liquidity pools",
      icon: Layers,
    },
  ];

  return (
    <form onSubmit={handleFormSubmit} className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Create Swap Intent</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Specify desired outcome — protocol handles execution</p>
        </div>
        <div className="rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-[10px] font-mono text-zinc-400">
          Soroban V21
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 flex items-center gap-2 rounded border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input Asset & Amount */}
      <div className="space-y-3">
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
            <span>You Send</span>
            <span>Balance: 1,000.00 {tokenIn.code}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="w-full bg-transparent text-xl font-mono font-semibold text-zinc-100 placeholder-zinc-600 focus:outline-none"
            />
            <select
              value={tokenIn.code}
              onChange={(e) => {
                const t = SUPPORTED_TOKENS.find((tok) => tok.code === e.target.value);
                if (t) setTokenIn(t);
              }}
              className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-100 focus:outline-none"
            >
              {SUPPORTED_TOKENS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.icon} {t.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Direction Toggle */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={swapTokens}
            className="rounded-full border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <ArrowDownUp className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Output Asset & Estimated Amount */}
        <div className="rounded-md border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
            <span>You Receive (Est.)</span>
            <span>Target Asset</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-full text-xl font-mono font-semibold text-zinc-100">
              {isCalculatingRoute ? (
                <span className="text-zinc-500 text-sm font-sans animate-pulse">Calculating path...</span>
              ) : calculatedRoute ? (
                calculatedRoute.estimatedOutput
              ) : (
                "0.00"
              )}
            </div>
            <select
              value={tokenOut.code}
              onChange={(e) => {
                const t = SUPPORTED_TOKENS.find((tok) => tok.code === e.target.value);
                if (t) setTokenOut(t);
              }}
              className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-100 focus:outline-none"
            >
              {SUPPORTED_TOKENS.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.icon} {t.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Execution Strategy Selector */}
      <div className="mt-5">
        <label className="text-xs font-mono text-zinc-400 mb-2 block">Routing Strategy</label>
        <div className="grid grid-cols-2 gap-2">
          {strategies.map((strat) => {
            const Icon = strat.icon;
            const active = executionType === strat.type;
            return (
              <button
                key={strat.type}
                type="button"
                onClick={() => setExecutionType(strat.type)}
                className={`flex flex-col p-2.5 rounded border text-left transition ${
                  active
                    ? "border-zinc-500 bg-zinc-800/80 text-zinc-100"
                    : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Icon className="h-3.5 w-3.5 opacity-80" />
                  <span>{strat.title}</span>
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 leading-tight">{strat.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slippage & Deadline Settings */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="text-[11px] font-mono text-zinc-400 mb-1 block">Max Slippage</label>
          <div className="flex items-center gap-1">
            {[10, 50, 100].map((bps) => (
              <button
                key={bps}
                type="button"
                onClick={() => setMaxSlippageBps(bps)}
                className={`flex-1 py-1 text-center rounded border font-mono text-[11px] ${
                  maxSlippageBps === bps
                    ? "border-zinc-600 bg-zinc-800 text-zinc-100 font-semibold"
                    : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                {bps / 100}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-zinc-400 mb-1 block">Deadline</label>
          <select
            value={deadlineMinutes}
            onChange={(e) => setDeadlineMinutes(Number(e.target.value))}
            className="w-full rounded border border-zinc-800 bg-zinc-900/50 px-2 py-1 font-mono text-[11px] text-zinc-300 focus:outline-none"
          >
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>
      </div>

      {/* Route Breakdown Summary */}
      {calculatedRoute && (
        <div className="mt-4 rounded border border-zinc-800/80 bg-zinc-900/30 p-3 space-y-1.5 text-[11px] font-mono text-zinc-400">
          <div className="flex justify-between">
            <span>Route Path:</span>
            <span className="text-zinc-200">{calculatedRoute.dexSources.join(" → ")}</span>
          </div>
          <div className="flex justify-between">
            <span>Est. Price Impact:</span>
            <span className="text-emerald-400 font-semibold">{calculatedRoute.priceImpact}</span>
          </div>
          <div className="flex justify-between">
            <span>Protocol Fee:</span>
            <span className="text-zinc-200">{calculatedRoute.protocolFee}</span>
          </div>
          <div className="flex justify-between">
            <span>MEV Protection:</span>
            <span className={calculatedRoute.mevProtected ? "text-emerald-400" : "text-zinc-400"}>
              {calculatedRoute.mevProtected ? "Active (Batch Delay)" : "Standard Sequencing"}
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-5 w-full rounded bg-zinc-100 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50 active:scale-98"
      >
        {isSubmitting
          ? "Signing & Submitting Intent..."
          : !isConnected
          ? "Connect Wallet to Submit"
          : "Submit Swap Intent"}
      </button>
    </form>
  );
}
