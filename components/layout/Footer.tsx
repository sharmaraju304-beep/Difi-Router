import Link from "next/link";
import { STELLAR_CONFIG } from "@/lib/stellar/config";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 py-6 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-3 font-mono">
          <span>Intent-Based DeFi Router</span>
          <span className="text-zinc-700">•</span>
          <span className="text-zinc-400">Soroban Contract Engine</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px]">
          <a
            href={`${STELLAR_CONFIG.explorerBaseUrl}/contract/${STELLAR_CONFIG.contractId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition"
          >
            Stellar Expert Testnet ↗
          </a>
          <a
            href="https://developers.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition"
          >
            Stellar Docs ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
