"use client";

import { useWallet } from "@/hooks/useWallet";
import { useIntentEngine } from "@/hooks/useIntentEngine";
import { Wallet, ShieldCheck, RefreshCw, ExternalLink, ArrowRight } from "lucide-react";
import { STELLAR_CONFIG, SUPPORTED_TOKENS } from "@/lib/stellar/config";
import Link from "next/link";

export default function DashboardPage() {
  const { isConnected, address, walletType, network, xlmBalance, tokens, refreshBalances, setModalOpen } = useWallet();
  const { intents } = useIntentEngine();

  const userIntents = address ? intents.filter((i) => i.userAddress === address) : intents;

  return (
    <div className="space-y-6">
      {/* Top Title & Wallet Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Wallet Dashboard</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Account state, token balances, and registered intents</p>
        </div>

        {!isConnected ? (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
          >
            <Wallet className="h-4 w-4" />
            <span>Connect Wallet</span>
          </button>
        ) : (
          <button
            onClick={refreshBalances}
            className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition"
          >
            <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
            <span>Refresh Balances</span>
          </button>
        )}
      </div>

      {/* Account Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <span className="text-zinc-500 block text-[11px]">CONNECTED ADDRESS</span>
          <span className="text-zinc-200 font-bold block mt-1">
            {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "Not Connected"}
          </span>
          <span className="text-zinc-500 text-[10px] block mt-1">Wallet Type: {walletType || "—"}</span>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <span className="text-zinc-500 block text-[11px]">NATIVE BALANCE</span>
          <span className="text-emerald-400 text-lg font-bold block mt-1">{xlmBalance} XLM</span>
          <span className="text-zinc-500 text-[10px] block mt-1">Network: {network}</span>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <span className="text-zinc-500 block text-[11px]">TOTAL INTENTS SUBMITTED</span>
          <span className="text-zinc-100 text-lg font-bold block mt-1">{userIntents.length}</span>
          <span className="text-zinc-500 text-[10px] block mt-1">Soroban Contract Engine</span>
        </div>
      </div>

      {/* Token Balances Grid */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-zinc-100 mb-4">Supported Testnet Assets</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
          {SUPPORTED_TOKENS.map((tok) => {
            const bal = tokens[tok.code] || (tok.code === "XLM" ? xlmBalance : "0.0000000");
            return (
              <div key={tok.code} className="rounded border border-zinc-800 bg-zinc-900/50 p-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tok.icon}</span>
                  <div>
                    <span className="font-bold text-zinc-200">{tok.code}</span>
                    <p className="text-[10px] text-zinc-500">{tok.name}</p>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 block">Balance</span>
                  <span className="text-sm font-bold text-zinc-100">{bal}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action to Intent Builder */}
      <div className="flex justify-between items-center rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div>
          <h3 className="text-xs font-semibold text-zinc-200">Ready to execute a trade?</h3>
          <p className="text-[11px] text-zinc-400">Specify your swap parameters in the Intent Builder.</p>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 rounded bg-zinc-100 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition"
        >
          <span>Go to Intent Builder</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
