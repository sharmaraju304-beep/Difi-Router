import { ActivityEvent } from "@/types/intent";

export type EventCallback = (event: ActivityEvent) => void;

class EventSubscriber {
  private listeners: Set<EventCallback> = new Set();
  private timer: NodeJS.Timeout | null = null;

  public subscribe(cb: EventCallback): () => void {
    this.listeners.add(cb);
    if (!this.timer) {
      this.startPolling();
    }
    return () => {
      this.listeners.delete(cb);
      if (this.listeners.size === 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    };
  }

  private startPolling() {
    // Poll every 5 seconds for Soroban contract events
    this.timer = setInterval(() => {
      // Simulate real-time protocol event stream if no new events
    }, 5000);
  }

  public emitMockEvent(event: ActivityEvent) {
    this.listeners.forEach((cb) => cb(event));
  }
}

export const eventSubscriber = new EventSubscriber();
