"use client";

import { ActivityFeedComponent } from "@/components/activity/ActivityFeedComponent";
import { Activity } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <span>Real-Time Activity Stream</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Live stream of events emitted directly by the Soroban Intent Router smart contract
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ActivityFeedComponent />
      </div>
    </div>
  );
}
