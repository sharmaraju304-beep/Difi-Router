"use client";

import { IntentForm } from "@/components/intent/IntentForm";
import { RouteVisualizer } from "@/components/routing/RouteVisualizer";

export default function BuilderPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-4">
        <h1 className="text-xl font-bold text-zinc-100">Intent Builder</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Configure high-level swap parameters and review routing execution</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <IntentForm />
        </div>
        <div className="lg:col-span-6">
          <RouteVisualizer />
        </div>
      </div>
    </div>
  );
}
