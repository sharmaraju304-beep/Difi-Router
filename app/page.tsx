"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Layers, Cpu, CheckCircle2, ArrowRightLeft } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-mono text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Soroban Smart Contract Live on Stellar Testnet</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl text-zinc-100 font-sans">
          Intent-Based DeFi Routing on Stellar
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans max-w-2xl mx-auto">
          Describe the outcome you want. Our protocol automatically calculates, splits, and executes the optimal routing strategy across Soroswap, Phoenix, and Stellar DEX with MEV protection.
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/builder"
            className="flex items-center gap-2 rounded bg-zinc-100 px-5 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            <span>Launch Intent Builder</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/activity"
            className="flex items-center gap-2 rounded border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800"
          >
            <span>View Live Activity</span>
          </Link>
        </div>
      </section>

      {/* Protocol Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Intent Volume", val: "$4,281,950", detail: "Stellar Testnet Simulated" },
          { label: "Average Execution Time", val: "1.2s", detail: "Multi-Source Parallel Routing" },
          { label: "MEV Front-Run Defended", val: "99.8%", detail: "Soroban Batch Sequencing" },
          { label: "Liquidity Pools Aggregated", val: "18+", detail: "Soroswap + Phoenix + SDEX" },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono">
            <span className="text-[11px] text-zinc-500 block">{stat.label}</span>
            <span className="text-2xl font-bold text-zinc-100 mt-1 block">{stat.val}</span>
            <span className="text-[10px] text-zinc-400 mt-1 block">{stat.detail}</span>
          </div>
        ))}
      </section>

      {/* Problem vs Solution Comparison */}
      <section className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-rose-500"></span>
            <span>The Problem: Manual DeFi Execution</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Traders must manually compare DEX prices, check liquidity depth, split transactions across multiple pools, calculate gas fees, and stay vulnerable to front-running and slippage loss.
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-500 font-mono pt-2">
            <li>✗ Fragmented liquidity across multiple DEXs</li>
            <li>✗ High risk of MEV sandwich attacks</li>
            <li>✗ Manual slippage calculation errors</li>
          </ul>
        </div>

        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>The Solution: Intent Engine</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Users specify desired input/output and bounds. The Soroban smart contract validates conditions, splits swaps across optimal paths, and executes in a single transaction.
          </p>
          <ul className="space-y-1.5 text-xs text-zinc-300 font-mono pt-2">
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Automated optimal path calculation</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Embedded MEV protection & batching</li>
            <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Real-time status event stream</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
