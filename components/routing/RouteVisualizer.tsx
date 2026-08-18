"use client";

import { useIntentEngine } from "@/hooks/useIntentEngine";
import { ArrowRight, Layers, ShieldCheck, Zap, Info } from "lucide-react";

export function RouteVisualizer() {
  const { calculatedRoute, tokenIn, tokenOut, amountIn, executionType } = useIntentEngine();

  if (!calculatedRoute) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center text-xs text-zinc-500">
        <div>
          <Layers className="mx-auto h-8 w-8 text-zinc-700 mb-2" />
          <p>Enter an input amount to calculate the optimal execution route.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-zinc-100">Calculated Execution Route</h3>
        </div>
        <span className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          Est. Latency: {calculatedRoute.executionTimeMs}ms
        </span>
      </div>

      {/* Visual Path Diagrams */}
      <div className="space-y-4">
        {/* Step Visualizer */}
        <div className="rounded-md border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-3">
            <span>Aggregated Routing Nodes</span>
            <span>Split Percent</span>
          </div>

          <div className="space-y-3">
            {calculatedRoute.steps.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                    0{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
                      <span>{step.dex}</span>
                      <span className="text-[10px] font-mono text-zinc-500">Fee: {step.poolFee}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mt-0.5">
                      <span>{step.fromToken}</span>
                      <ArrowRight className="h-3 w-3 text-zinc-600" />
                      <span>{step.toToken}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-emerald-400">{step.splitPercent}%</span>
                  <p className="text-[10px] text-zinc-500">Allocation</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Efficiency & Protection Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>MEV Protection</span>
            </div>
            <p className="text-xs font-mono text-zinc-200 font-semibold">
              {calculatedRoute.mevProtected ? "Active (Batch Sequencing)" : "Standard Mempool"}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Minimizes front-running & sandwich attacks</p>
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1">
              <Info className="h-3.5 w-3.5 text-blue-400" />
              <span>Expected Output</span>
            </div>
            <p className="text-xs font-mono text-emerald-400 font-semibold">
              {calculatedRoute.estimatedOutput} {tokenOut.code}
            </p>
            <p className="text-[10px] text-zinc-500 mt-1">Net of protocol fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}
