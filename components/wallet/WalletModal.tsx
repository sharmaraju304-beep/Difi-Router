"use client";

import { useWallet } from "@/hooks/useWallet";
import { X, CheckCircle2, AlertTriangle, Wallet, ArrowRight } from "lucide-react";
import { WalletType } from "@/types/intent";

export function WalletModal() {
  const { isModalOpen, setModalOpen, connect, isLoading, error } = useWallet();

  if (!isModalOpen) return null;

  const walletOptions: { type: WalletType; name: string; desc: string; icon: string; badge?: string }[] = [
    {
      type: "freighter",
      name: "Freighter",
      desc: "Official Stellar browser extension wallet",
      icon: "⚡",
      badge: "Recommended",
    },
    {
      type: "albedo",
      name: "Albedo",
      desc: "Web-based Stellar web keypair manager",
      icon: "🌐",
    },
    {
      type: "xbull",
      name: "xBull Wallet",
      desc: "Advanced mobile and extension wallet",
      icon: "🐂",
    },
    {
      type: "mock",
      name: "Testnet Developer Wallet",
      desc: "Instant sandbox account for instant testing",
      icon: "🛠️",
      badge: "Fast Test",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Connect Stellar Wallet</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Select your preferred wallet provider</p>
          </div>
          <button
            onClick={() => setModalOpen(false)}
            className="rounded p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-4 flex items-start gap-2.5 rounded border border-rose-900/50 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-semibold">Connection Failed</p>
              <p className="text-rose-400/90 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Wallet List */}
        <div className="mt-4 space-y-2">
          {walletOptions.map((w) => (
            <button
              key={w.type}
              disabled={isLoading}
              onClick={() => connect(w.type)}
              className="group flex w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/60 p-3 text-left transition hover:border-zinc-700 hover:bg-zinc-900 disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{w.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">{w.name}</span>
                    {w.badge && (
                      <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                        {w.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">{w.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-zinc-600 transition group-hover:text-zinc-300 group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-6 border-t border-zinc-800/80 pt-4 text-center text-[11px] text-zinc-500 font-mono">
          Network: <span className="text-zinc-300">Stellar Testnet</span>
        </div>
      </div>
    </div>
  );
}
