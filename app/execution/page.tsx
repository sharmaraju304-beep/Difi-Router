"use client";

import { ExecutionTracker } from "@/components/execution/ExecutionTracker";
import { Cpu } from "lucide-react";

export default function ExecutionPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-amber-400" />
          <span>Live Execution Tracker</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Real-time tracking of Soroban contract invocation & transaction lifecycle
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ExecutionTracker />
      </div>
    </div>
  );
}
