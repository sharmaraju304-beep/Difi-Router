"use client";

import { TransactionHistoryTable } from "@/components/history/TransactionHistoryTable";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <History className="h-5 w-5 text-blue-400" />
          <span>Execution History</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Complete indexed history of submitted intents, execution paths, and transaction hashes
        </p>
      </div>

      <TransactionHistoryTable />
    </div>
  );
}
