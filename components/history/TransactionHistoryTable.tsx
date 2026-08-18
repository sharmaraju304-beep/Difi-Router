"use client";

import { useIntentEngine } from "@/hooks/useIntentEngine";
import { STELLAR_CONFIG } from "@/lib/stellar/config";
import { ExternalLink, Search, Download, ArrowRightLeft } from "lucide-react";
import { useState } from "react";

export function TransactionHistoryTable() {
  const { intents } = useIntentEngine();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = intents.filter((i) => {
    const term = searchTerm.toLowerCase();
    return (
      i.id.toLowerCase().includes(term) ||
      i.tokenIn.code.toLowerCase().includes(term) ||
      i.tokenOut.code.toLowerCase().includes(term) ||
      i.userAddress.toLowerCase().includes(term)
    );
  });

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,User,TokenIn,AmountIn,TokenOut,ExecutedOut,Status,Timestamp,ContractId"]
        .concat(
          filtered.map(
            (i) =>
              `${i.id},${i.userAddress},${i.tokenIn.code},${i.amountIn},${i.tokenOut.code},${i.executedAmountOut || 0},${i.status},${i.createdAt},${STELLAR_CONFIG.contractId}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `stellar_intents_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-5 shadow-xl">
      {/* Top Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 mb-4 gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by ID, token, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-900/60 pl-8 pr-3 py-1.5 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 rounded border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-mono text-zinc-300 hover:bg-zinc-800 transition"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-[11px] text-zinc-500">
              <th className="pb-3 font-semibold">INTENT ID</th>
              <th className="pb-3 font-semibold">STRATEGY</th>
              <th className="pb-3 font-semibold">SWAP PAIR</th>
              <th className="pb-3 font-semibold">AMOUNT IN</th>
              <th className="pb-3 font-semibold">RECEIVED OUT</th>
              <th className="pb-3 font-semibold">STATUS</th>
              <th className="pb-3 font-semibold">TIME</th>
              <th className="pb-3 font-semibold text-right">EXPLORER</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-zinc-500">
                  No intent history records found.
                </td>
              </tr>
            ) : (
              filtered.map((intent) => (
                <tr key={intent.id} className="hover:bg-zinc-900/40 transition">
                  <td className="py-3 text-zinc-200 font-bold">{intent.id}</td>
                  <td className="py-3 text-zinc-400 uppercase text-[10px]">
                    {intent.executionType.replace("_", " ")}
                  </td>
                  <td className="py-3 text-zinc-200">
                    {intent.tokenIn.code} → {intent.tokenOut.code}
                  </td>
                  <td className="py-3 text-zinc-300">
                    {intent.amountIn} {intent.tokenIn.code}
                  </td>
                  <td className="py-3 text-emerald-400 font-semibold">
                    {intent.executedAmountOut ? `${intent.executedAmountOut} ${intent.tokenOut.code}` : "—"}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        intent.status === "confirmed"
                          ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                          : intent.status === "executing"
                          ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                          : intent.status === "pending"
                          ? "bg-blue-950/80 text-blue-400 border border-blue-800"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {intent.status}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-500 text-[11px]">
                    {new Date(intent.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-right">
                    <a
                      href={`${STELLAR_CONFIG.explorerBaseUrl}/contract/${STELLAR_CONFIG.contractId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <span>Contract</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
